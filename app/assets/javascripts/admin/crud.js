app.factory('crud', ['$http', '$compile', function($http, $compile) {
  // checked rows in table {item.$$hashKey : item}
  var _selection = {};

  return {
    extend: function(scope, element) {
      document.title = '';
      scope.title = '';
      scope.show_panel = 'list';
      scope.primaryKey = '';

      scope.paginator = {};
      scope.paginator.count = 0;
      scope.paginator.page = 0;
      scope.paginator.perPage = 0;
      scope.paginator.lastPage = 0;

      // read data from server
      scope.read = function(c, m, params) {
        if (!params) {
          params = '';
        }

        var p = $http({
          method: 'GET',
          url: c + '/' + m + params,
        });
        p.success(function(response){
          document.title = response.title;
          scope.title = response.title;
          // must exclude these fields when saving
          scope.relation = response.relation;
          //scope.$broadcast('afterRead', response);
          if (angular.isFunction(scope.afterRead)) {
            scope.afterRead(response);
          }
        });
        p.error(function(response, status) {
          Util.hideIosNotify();
          Util.notify('操作失败', 'error');
        });
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

                if (angular.isFunction(scope.afterItemCreated)) {
                  scope.afterItemCreated(response);
                }
                Util.notify(response.desc);
                scope.show_panel = 'list';
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
              if (angular.isFunction(scope.afterItemUpdated)) {
                scope.afterItemUpdated(response);
              }
              Util.notify(response.desc);
              scope.show_panel = 'list';
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

              if (angular.isFunction(scope.afterItemDeleted)) {
                scope.afterItemDeleted(response);
              }
              Util.notify(response.desc);
              scope.show_panel = 'list';
            } else {
              Util.notify(response.desc, 'error');
            }
          }
          break;
        default:
          Util.hideIosNotify();
          Util.notify('操作失败', 'error');
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
          Util.notify('操作失败', 'error');
        });
      };

      // show edit panel
      scope.edit = function(item) {
        $("#editForm .has-success").removeClass("has-success");
        $("#editForm .has-error").removeClass("has-error");

        scope.editingItem = item;
        scope.itemModel = angular.copy(item);

        scope.show_panel = 'edit';
        //$animate.enter(element, parentElement).then(function() {
        //  angular.element(element).find("input:text").first().focus();
        //});
        //  // after animating, focus to the first textbox and select all text
        //  $("#panel-edit :text").first().focus();
        //  $("#panel-edit :text").first().select();

        // save when press enter
        $("#panel-edit .form-control").off('keydown');
        $("#panel-edit .form-control").on('keydown', function(e){
          if (e.keyCode == 13){
            scope.save();
          }
        });
      };

      scope.uniqueCount = 0;

      // 唯一验证虚函数
      scope.checkUnique = function(formControl, primaryKey, model, value) {
        var params = '?eq={"' + model + '":"' + value + '"}';
        if (primaryKey != undefined && primaryKey != '') {
          params += '&noteq={"' + $("#primaryKey").val() + '":"' + primaryKey + '"}';
        }
        //var count = scope.getDuplicateCount(params, focusForm); 
        //var count = 0;

        var p = $http({
          method: 'GET',
          url: Util.getController() + '/get_count' + params,
        });

        p.success(function(response) {
          // 非 '0' 表示存在重复
          if (response != '0' && response != '"0"' && response != '""0""') {
            formControl.parent().removeClass('has-success');
            formControl.parent().addClass('has-error');
            formControl.focus();
            return;
          } else {
            formControl.parent().removeClass('has-error');
            formControl.parent().addClass('has-success');
          }

          scope.uniqueCount -= 1;

          if (scope.uniqueCount <= 0) {
            Util.showIosNotify('请稍候...');
            scope.saveCommit();
          }
        });
      }

      scope.saveCommit = function() {
        // 移除表单校验时添加的样式
        //$("#editForm .has-error").removeClass("has-error");
        //$("#editForm .has-success").removeClass("has-success");

        var item = {};
        var data = {};

        // 遍历model
        for(var key in scope.itemModel) {
          item[key] = scope.itemModel[key];

          // 排除angular生成的$$hashkey，以及其他自定义/特殊字段
          if (key.substring(0, 2) != '$$' && key != scope.primaryKey && key != 'created_at' && key != 'updated_at') {
            // 保存时排除关联字段
            if (!angular.isUndefined(scope.relation)) {
              var except = false;
              angular.forEach(scope.relation, function(relation_value, relation_key) {
                if (key == relation_value) {
                  except = true;
                } 
              });

              if (except === false) {
                // 排除排除字段
                //if (key.indexOf(scope.exclude) == -1) {
                  data[key] = item[key];
               // }
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

      scope.save = function() {
        // validate required fields
        if (angular.isDefined(scope.validate)) {
          if (scope.validate() === false) {
            return;
          }
        }

        // validate unique fields
        var controls = $("#editForm input[unique]");
        scope.uniqueCount = controls.length;

        if (controls.length > 0) {
          for (var i = 0; i < controls.length; i++) {
            var err = scope.checkUnique($(controls[i]),
                scope.itemModel[scope.primaryKey],
                $(controls[i]).attr('id'),
                $(controls[i]).val().trim());
          }
        } else {
          Util.showIosNotify('请稍候...');
          scope.saveCommit();
        }
      };

      scope.validate = function() {
        var result = true;
        var value = '';
        var controlName = '';

        var controls = $("#editForm [required]");
        for (var i = 0; i < controls.length; i++) {
          // 如果必填输入框值为空字符串
          value = $(controls[i]).val().trim();

          if (value == '' || value == '? undefined:undefined ?' || value == '?') {
            Util.focus($(controls[i]));
            if (controls[i].type == 'text') {
              controls[i].select();
            }
            controlName = $(controls[i]).attr("placeholder");
            if (!angular.isUndefined(controlName) && controlName != '') {
              Util.notify("请输入" + controlName, 'error');
            }

            return false;
          }
        }

        var controls = $("#editForm input[numeric]");
        for (var i = 0; i < controls.length; i++) {
          // 输入框值为非数字
          if (isNaN($(controls[i]).val().trim())) {
            Util.focus($(controls[i]));
            controls[i].select();
            controlName = $(controls[i]).attr("placeholder");
            if (!angular.isUndefined(controlName) && controlName != '') {
              Util.notify(controlName + "请输入数字", 'error');
            }
            return false;
          }
        }

        return result;
      };

      scope.$on('batchDelete', function(event, data) {
        if (data !== undefined) {
          scope.batchDelete(data.selection, data.controller, data.primaryKey);
        }
      });

      scope.batchDelete = function(selection, controller, primaryKey) {
        var items = [];

        for(var key in selection) {
          items.push(selection[key]);
        }
        scope.delConfirm(items, controller, primaryKey);
        _selection = selection;
      }

      // 删除确认
      scope.$on('delConfirm', function(event, data){
        if (data !== undefined) {
          scope.primaryKey = data.primaryKey;
          scope.delConfirm(data.item);
        }
      });

      scope.delConfirm = function(item, message) {
        if (message == undefined) {
          message = '确定删除吗？';
        }
        // 如果模态对话框不存在则创建html
        if ($('#delConfirmModal').length <= 0) {
          var html = '<div class="modal fade" id="delConfirmModal">'
            + '    <div class="modal-dialog">'
            + '        <div class="modal-content">'
            + '            <div class="modal-header label-danger">'
            + '               <a href="#" class="close" data-dismiss="modal">&times;</a>'
            + '               <h4>提示框</h4>'
            + '            </div>'
            + '            <div class="modal-body">'
            + '                <h3 class="text-center">' + message + '</h3>'
            + '            </div>'
            + '            <div class="modal-footer">'
            + '                <a class="btn btn-danger ios-notify-show" ng-click="del();" data-dismiss="modal"><i class="fa fa-trash-o fa-lg"></i></a>'
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

      // 删除
      scope.del = function() {
        if (Util.isArray(scope.itemDel)) {
          // 删除多条数据
          var p = $http({
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            data: {items: scope.itemDel},
            url: Util.getController() + '/multi_delete'
          });
          p.success(function(response){
            if (response.code == "0") {
              for(var i = 0; i< scope.itemDel.length; i++) {
                //scope.$broadcast('afterItemDeleted', scope.itemDel[i]);
                if (angular.isFunction(scope.afterItemDeleted)) {
                  scope.afterItemDeleted(response);
                }
              }
              notify('删除成功');
            } else {
              notify(response.desc);
            }
          })
          p.error(function(response, status) {
            Util.notify('系统错误，请联系管理员', 'error');
          })

          // 批量删除状态复位
          _selection = {};
          scope.$broadcast('afterBatchDelete', {});
        } else {
          var data = {}; 
          data[scope.primaryKey] = scope.itemDel[scope.primaryKey];
          scope.write(Util.getController(), 'destroy', data, scope.itemDel);
        }
      };

      /**
       * batchUpdate 专属的 write (后期应考虑与 scope.write 整合)
       * @param {
       *      method     : method name
       *      data       : http post data
       *      item       : item object
       *      next       : next after http success
       *      sucess     : call back after http sucess [可选]
       * }
       */
      scope.writeForBatchUpdate = function(options) {
        var p = $http({
          method: 'POST',
          url: Util.controller + '/' + options.method,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: options.data,
        });

        p.success(function(response, status){
          if (options.success) {
            options.success(options.item);
            Util.notify('更新成功');
          }
          options.next();
        });

        p.error(function(response, status) {
          Util.hideIosNotify('操作失败');
        });
      }

      /**
       * 批量更新
       *
       * @param {
       *   selection  : selected item collection
       *   method     : method name
       *   fnBefore   : call back before batch update
       *   fnAfter    : call back after batch update
       *   fnEach     : call back after each success
       * }
       */
      scope.batchUpdate = function(options) {
        var cancel = true;
        var items = [];

        for(var key in options.selection) {
          items.push(options.selection[key]);
        }

        var fnDone = function() {
          Util.hideIosNotify('完成', 'img/cross.png');
          options.fnAfter && options.fnAfter();
        }

        var index = 0;
        var fnContinue = function() {
          if (index <= items.length) {
            var item = items[index];
            if (index === 0) {
              Util.showIosNotify('请稍后...')
            }
            index++;

            scope.writeForBatchUpdate({
              method      : options.method,
              data        : scope.primaryKey + '=' + item[scope.primaryKey],
              item        : item,
              next        : (index >= items.length) ? fnDone : fnContinue,
              success     : options.fnEach,
            });
          }
        }

        if (options.fnBefore !== undefined && options.fnBefore !== null) {
          options.fnBefore(fnContinue);
        }
      }
    }
  };
}]);

