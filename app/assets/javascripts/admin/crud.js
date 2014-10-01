app.factory('crud', ['$http', '$compile', '$animate', '$q', 'validation', function($http, $compile, $animate, $q, validation) {
  'use strict';

  return {
    extend: function(scope, element) {
      validation.extend(scope, element);

      document.title = '';
      scope.title = '';
      scope.primaryKey = '';

      scope.beforeRead = [];
      scope.afterRead = [];
      scope.beforeCreate = [];
      scope.afterCreated = [];
      scope.beforeUpdate = [];
      scope.afterUpdated = [];
      scope.beforeDelete = [];
      scope.afterDeleted= [];

      scope.list = {};
      scope.paginator = {};
      scope.paginator.count = 0;
      scope.paginator.page = 0;
      scope.paginator.perPage = 0;
      scope.paginator.lastPage = 0;

      // read data from server
      scope.read = function(c, m, params) {
        var beforeResult = true;
        for (var i = 0; i < scope.beforeRead.length; i++) {
          beforeResult = beforeResult && (scope.beforeRead[i])();
        }

        if (beforeResult === true) {
          if (!params) {
            params = '';
          }

          var p = $http({
            method: 'GET',
            url: c + '/' + m + params,
          });
          p.success(function(response){
            scope.title = response.title;
            document.title = scope.title;
            // must exclude relation fields when saving
            scope.relation = response.relation;

            for (var i = 0; i < scope.afterRead.length; i++) {
              (scope.afterRead[i])(response);
            }
          });
          p.error(function(response, status) {
            Util.hideIosNotify();
            Util.notify('Error', 'error');
          });
        }
      };

      // write data to server
      scope.write = function(c, m, data, item) {
        var url = '';
        var success = {};
        var method = '';

        data['authenticity_token'] = $("meta[name='csrf-token']").attr('content');

        switch (m) {
          case 'create':
            url = c;
            method = 'POST';
            success = function(response, status) {
              Util.hideIosNotify();
              if (response.code === 1) {
                // update primary key into new item
                item[scope.primaryKey] = response[scope.primaryKey];

                for (var i = 0; i < scope.afterCreated.length; i++) {
                  (scope.afterCreated[i])(item);
                }
                Util.notify(response.desc);
                scope.showList();
              } else {
                Util.notify(response.desc, 'error');
              }
            };
            break;
        case 'edit':
          url = c + '/' + item[scope.primaryKey];
          method = 'PUT';
          data[scope.primaryKey] = item[scope.primaryKey];
          success = function(response, status) {
            Util.hideIosNotify();
            if (response.code === 1) {
              for (var i = 0; i < scope.afterUpdated.length; i++) {
                (scope.afterUpdated[i])(response);
              }
              Util.notify(response.desc);
              scope.showList();
            } else {
              Util.notify(response.desc, 'error');
            }
          };
          break;
        case 'destroy':
          url = c + '/' + item[scope.primaryKey];
          method = 'DELETE';
          data[scope.primaryKey] = item[scope.primaryKey];
          success = function(response, status) {
            Util.hideIosNotify();
            if (response.code === 1) {
              // remove item from list, and reindex the list
              var index = scope.list.data.indexOf(item);
              scope.list.data.splice(index, 1);

              for (var i = 0; i < scope.afterDeleted.length; i++) {
                (scope.afterDeleted[i])(response);
              }
              Util.notify(response.desc);
              scope.showList();
            } else {
              Util.notify(response.desc, 'error');
            }
          }
          break;
        default:
          Util.hideIosNotify();
          Util.notify('Error', 'error');
          return;
        }

        var p = $http({
          method: method,
          url: url,
          headers: {'Content-Type': 'application/json'},
          data: data,
        });

        p.success(success);
        p.error(function(response, status) {
          Util.hideIosNotify();
          Util.notify('Error', 'error');
        });
      };

      // show edit panel
      scope.edit = function(item) {
        scope.editingItem = item;
        scope.itemModel = angular.copy(item);

        scope.showEdit();

        element.find("#editForm .has-success").removeClass("has-success");
        element.find("#editForm .has-error").removeClass("has-error");
        //$animate.setClass(element.find("#panel-list"), 'show', 'hidden')
        //.then($animate.setClass(element.find("#panel-edit"), 'hidden', 'show'));
        //.then(function() {
        //  console.log('entered');
        //});
      };

      scope.save = function() {
        var i, beforeResult = true;

        // before Create/Update
        if (scope.itemModel[scope.primaryKey]) {
          for (i = 0; i < scope.beforeUpdate.length; i++) {
            beforeResult = beforeResult && (scope.beforeUpdate[i])();
          }
        } else {
          for (i = 0; i < scope.beforeCreate.length; i++) {
            beforeResult = beforeResult && (scope.beforeCreate[i])();
          }
        }
        if (beforeResult === false) {
          return false;
        }

        // validate required fields
        if (angular.isDefined(scope.validate)) {
          if (scope.validate() === false) {
            return false;
          }
        }

        // validate unique fields
        if (angular.isDefined(scope.checkUnique)) {
          if (scope.checkUnique() === false) {
            return false;
          }
        }

        Util.showIosNotify('Saving...');
        scope.saveCommit();
      };

      scope.saveCommit = function() {
        var item = {};
        var data = {};

        // iterate model
        for(var key in scope.itemModel) {
          item[key] = scope.itemModel[key];

          // exclude $$hashkey generated by angular, and some special fields
          if (key.substring(0, 2) != '$$' && key != scope.primaryKey && key != 'created_at' && key != 'updated_at') {
            // exclude relation fields
            if (!angular.isUndefined(scope.relation)) {
              var except = false;
              angular.forEach(scope.relation, function(relation_value, relation_key) {
                if (key == relation_value) {
                  except = true;
                } 
              });

              if (except === false) {
                data[key] = item[key];
              }
            } else {
              data[key] = item[key];
            }
          }
        }

        if (item[scope.primaryKey]) {
          scope.write(Util.getController(), 'edit', data, item);
        } else {
          scope.write(Util.getController(), 'create', data, item);
        }
      };

      scope.bulkDelete = function(selection) {
        var items = [];

        for(var key in selection) {
          items.push(selection[key]);
        }
        scope.delConfirm(items);
      }

      scope.delConfirm = function(item, message) {
        message = message || 'Are you sure to delete?';

        // add html
        if ($('#delConfirmModal').length <= 0) {
          var html = '<div class="modal fade" id="delConfirmModal">'
            + '    <div class="modal-dialog">'
            + '        <div class="modal-content">'
            + '            <div class="modal-header label-danger">'
            + '               <a href="#" class="close" data-dismiss="modal">&times;</a>'
            + '               <h4>Confirm Box</h4>'
            + '            </div>'
            + '            <div class="modal-body">'
            + '                <h3 class="text-center">' + message + '</h3>'
            + '            </div>'
            + '            <div class="modal-footer">'
            + '                <a class="btn btn-danger" ng-click="del();" data-dismiss="modal"><i class="fa fa-trash-o fa-lg"></i></a>'
            + '                <a class="btn btn-default" data-dismiss="modal"><i class="fa fa-times fa-lg"></i></a>'
            + '            </div>'
            + '        </div>'
            + '    </div>'
            + '</div>';

          element.append($compile(html)(scope));
        }

        scope.itemDel = item;
        $('#delConfirmModal').modal("show");
      };

      // delete data
      scope.del = function() {
        var beforeResult = true;
        for (var i = 0; i < scope.beforeDelete.length; i++) {
          beforeResult = beforeResult && (scope.beforeDelete[i])();
        }

        if (beforeResult === true) {
          Util.showIosNotify('processing...');

          // bulk delete
          if (Util.isArray(scope.itemDel)) {
            var ids = [];
            var authenticity_token = $("meta[name='csrf-token']").attr('content');

            for (var i = 0; i< scope.itemDel.length; i++) {
              ids.push(scope.itemDel[i].id);
            }

            // delete multiple rows 
            var p = $http({
              method: 'DELETE',
              headers: {'Content-Type': 'application/json'},
              data: {ids: ids, authenticity_token: authenticity_token},
              url: Util.getController() + '/bulk_delete'
            });
            p.success(function(response){
              if (response.code === 1) {
                for(var i = 0; i< scope.itemDel.length; i++) {
                  // remove item from list, and reindex the list
                  var index = scope.list.data.indexOf(scope.selection.pop());
                  scope.list.data.splice(index, 1);

                  for (var i = 0; i < scope.afterDeleted.length; i++) {
                    (scope.afterDeleted[i])(response);
                  }
                }
              }

              Util.hideIosNotify();
              Util.notify(response.desc);
            })
            p.error(function(response, status) {
              Util.hideIosNotify();
              Util.notify('Error', 'error');
            })
          } else {
            var data = {}; 
            data[scope.primaryKey] = scope.itemDel[scope.primaryKey];
            scope.write(Util.getController(), 'destroy', data, scope.itemDel);
          }
        }
      };

      scope.showList = function() {
        element.find('#panel-edit').removeClass('show').addClass('hidden');
        element.find('#panel-list').removeClass('hidden').addClass('show');
      };

      scope.showEdit = function() {
        element.find('#panel-list').removeClass('show').addClass('hidden');
        element.find('#panel-edit').removeClass('hidden').addClass('show');
      };
    }
  };
}]);

