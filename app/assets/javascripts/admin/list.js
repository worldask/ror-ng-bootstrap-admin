// emacs: -*- coding: utf-8; js-indent-level: 2; -*- vi: set ai ts=2 sw=2 sts=2 et:
// factory for list pages
app.factory('list', ['$compile', 'crud', function($compile, crud) {
  'use strict';

  return {
    extend: function(scope, $element) {
      crud.extend(scope, $element);
      scope.selection = [];

      // before read
      scope.beforeRead.push(function() {
        // console.info("before read");
        return true;
      });

      // after read
      scope.afterRead.push(function(response) {
        // console.info("after read");

        scope.flagAfterItemCreated = true;
        scope.flagAfterItemUpdated = true;

        scope.primaryKey = response.primaryKey;
        if (scope.primaryKey == undefined) {
          scope.primaryKey = 'id';
        }

        scope.list = response.list;
        scope.selection = [];

        scope.paginator.count = parseInt(response.list.count);
        scope.paginator.page = parseInt(response.list.page);
        scope.paginator.perPage = parseInt(response.list.per_page);
        scope.paginator.lastPage = parseInt(response.list.last_page);
      });

      // before create
      scope.beforeCreate.push(function() {
        // console.info("before create");
        return true;
      });

      // after created
      scope.afterCreated.push(function(item) {
        // console.info("after created");

        if (scope.list !== undefined) {
          scope.list.data.unshift(item);
        }

        if (!angular.isUndefined(scope.relation) && scope.flagAfterItemCreated) {
          //scope.init();
        }
        scope.closeEdit();
      });

      // before Updated
      scope.beforeUpdate.push(function() {
        // console.info("before update");
        return true;
      });

      // after Updated
      scope.afterUpdated.push(function(item) {
        // console.info("after updated");

        for(var key in scope.itemModel) {
          scope.editingItem[key] = scope.itemModel[key];
        }
        
        if (!angular.isUndefined(scope.relation) && scope.flagAfterItemUpdated) {
          //scope.init();
        }
        scope.closeEdit();
      });

      // before deleted
      scope.beforeDelete.push(function() {
        // console.info("before delete");
        return true;
      });

      // after deleted
      scope.afterDeleted.push(function(item) {
        // console.info("after deleted");
      });
      
      // close edit panel
      scope.closeEdit = function() {
        scope.showList();
      };

      // close edit panel when pressing ESC
      $(document).keydown(function(e) {
        if(e.keyCode == 27){
          // 按Esc关闭编辑界面
          scope.closeEdit();
        }
      });

      // select/unselect checkbox
      scope.onSelect = function(item) {
        if (angular.isDefined(item.$$checked) && item.$$checked === false) {
          var index, i;

          for(i = 0; i< scope.selection.length; i++) {
            // remove item from list, and reindex the list
            index = scope.selection.indexOf(item);
            scope.selection.splice(index, 1);
          }
        } else {
          scope.selection.push(item);
        }
      };

      // search
      scope.search = function(keyword) {
        if (angular.isDefined(keyword) && keyword !== null && keyword !== '') {
          scope.read(Util.getController(), 'list', '?keyword=' + keyword);
        } 
      };

      // init 
      scope.init = function() {
        var controller = Util.getController();
        scope.read(controller, 'list');
        scope.list.keyword = '';
      };
    }
  };
}]);
