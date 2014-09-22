// emacs: -*- coding: utf-8; js-indent-level: 2; -*- vi: set ai ts=2 sw=2 sts=2 et:
'use strict';
// factory for list pages
app.factory('list', ['$compile', 'crud', function($compile, crud) {
  return {
    extend: function($scope, $element) {
      crud.extend($scope, $element);
      $scope.selection = {};

      // after read
      $scope.afterRead = function(response) {
        $scope.flagAfterItemCreated = true;
        $scope.flagAfterItemUpdated = true;

        $scope.primaryKey = response.primaryKey;
        if ($scope.primaryKey == undefined) {
          $scope.primaryKey = 'id';
        }

        $scope.list = response.list;
        $scope.selection = {};

        $scope.paginator.count = parseInt(response.list.count);
        $scope.paginator.page = parseInt(response.list.page);
        $scope.paginator.perPage = parseInt(response.list.per_page);
        $scope.paginator.lastPage = parseInt(response.list.last_page);
      };

      // after created
      $scope.afterItemCreated = function(item) {
        if ($scope.list !== undefined) {
          $scope.list.data.unshift(item);
        }

        if (!angular.isUndefined($scope.relation) && $scope.flagAfterItemCreated) {
          //$scope.init();
        }
        $scope.closeEdit();
      };

      // after Updated
      $scope.afterItemUpdated = function(item) {
        for(var key in $scope.itemModel) {
          $scope.editingItem[key] = $scope.itemModel[key];
        }
        
        if (!angular.isUndefined($scope.relation) && $scope.flagAfterItemUpdated) {
          //$scope.init();
        }
        $scope.closeEdit();
      };

      // after deleted
      $scope.afterItemDeleted = function(item) {
      };
      
      // close edit panel
      $scope.closeEdit = function() {
        $scope.show_panel = 'list';
      };

      // close edit panel when pressing ESC
      $(document).keydown(function(e) {
        if(e.keyCode == 27){
          // 按Esc关闭编辑界面
          $scope.closeEdit();
        }
      });

      // select/unselect checkbox
      $scope.onSelect = function(item) {
        if (angular.isDefined(item.$$checked) && item.$$checked === false) {
          delete $scope.selection[item.$$hashKey];
        } else {
          $scope.selection[item.$$hashKey] = item;
        }
      };

      // search
      $scope.search = function(keyword) {
        if (angular.isDefined(keyword) && keyword !== null && keyword !== '') {
          //$scope.read(Util.getController(), 'list', '?s={"keyword": "' + keyword + '"}');
          $scope.read(Util.getController(), 'list', '?keyword=' + keyword);
        } 
      };

      // 初始化列表
      $scope.init = function() {
        // 从url获取控制器名称
        var controller = Util.getController();
        $scope.read(controller, 'list');
        $scope.keyword = '';

        // 回车搜索
        $("#panel-list input[name=q]").off('keydown');
        $("#panel-list input[name=q]").on('keydown', function(e) {
          if (e.keyCode == 13) {
            $scope.search(this.value);
            this.select();
          }
        });
      };
    }
  };
}]);
