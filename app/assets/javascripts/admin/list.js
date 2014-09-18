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

        $scope.searchCondition = response.search_condition;
        angular.forEach($scope.searchCondition, function(value, key) {
          $scope[key] = value;
        });

        $scope.rowCount = parseInt(response.list.total);
        $scope.pageSize = parseInt(response.list.per_page);
        $scope.pageCount = parseInt(response.list.last_page);
        $scope.pageIndex = parseInt(response.list.current_page);

        $scope.paging();
      };

      // 已添加
      $scope.afterItemCreated = function(item) {
        if ($scope.list !== undefined) {
          $scope.list.data.unshift(item);
        }
        // 更新关联字段
        if (!angular.isUndefined($scope.relation) && $scope.flagAfterItemCreated) {
          //$scope.init();
        }
        $scope.closeEdit();
      };

      // 已更新
      $scope.afterItemUpdated = function(item) {
        for(var key in $scope.itemModel) {
          $scope.editingItem[key] = $scope.itemModel[key];
        }
        
        // 更新关联字段
        if (!angular.isUndefined($scope.relation) && $scope.flagAfterItemUpdated) {
          //$scope.init();
        }
        $scope.closeEdit();
      };

      // 已删除
      $scope.afterItemDeleted = function(item) {
      };
      
      // 关闭编辑界面
      $scope.closeEdit = function() {
        $scope.show_panel = 'list';
      };

      //Esc键关闭编辑界面
      $(document).keydown(function(e) {
        if(e.keyCode == 27){
          // 按Esc关闭编辑界面
          $scope.closeEdit();
        }
      });

      // checkbox 选中/取消
      $scope.onSelect = function(item) {
        if (angular.isDefined(item.$$checked) && item.$$checked === false) {
          delete $scope.selection[item.$$hashKey];
        } else {
          $scope.selection[item.$$hashKey] = item;
        }
      };

      // 搜索
      $scope.search = function(keyword) {
        if (angular.isUndefined(keyword) || keyword === null) {
          keyword = '';
        }

        $scope.read(Util.getController(), 'list', '?s={"keyword": "' + keyword + '"}');
      };

      // 跳到第几页
      $scope.gotoPage = function(page) {
        var params = '?page=' + page;

        if (angular.isDefined($scope.searchCondition) && $scope.searchCondition !== null && $scope.searchCondition !== '') {
          params += '&s={';

          var i = 0;
          for (key in $scope.searchCondition) {
            if (i > 0) {
              params += ', ';
            }
            params += '"' + key + '":"' + $scope.searchCondition[key] + '"';
            i++;
          }

          params += '}';
        }

        $scope.read(Util.getController(), 'list', params);
        $scope.paging();
      };

      // 分页
      $scope.paging = function() {
        $scope.htmlPaging = '';

        if ($scope.pageCount > 1) {
          $scope.htmlPaging += '<ul class="pagination">';

          // 如果当前是第一页，上一页不可用
          if ($scope.pageIndex > 1) {
            $scope.htmlPaging += '<li class="prev"><a href="javascript:" ng-click="gotoPage(1);"><i class="fa fa-angle-double-left fa-lg"></i></a></li>';
            $scope.htmlPaging += '<li class="prev"><a href="javascript:" ng-click="gotoPage(' + ($scope.pageIndex - 1) + ');"><i class="fa fa-angle-left fa-lg"></i></a></li>';
          } else {
            $scope.htmlPaging += '<li class="prev disabled"><a href="javascript:"><i class="fa fa-angle-double-left fa-lg"></i></a></li>';
            $scope.htmlPaging += '<li class="prev disabled"><a href="javascript:"><i class="fa fa-angle-left fa-lg"></i></a></li>';
          }

          // 显示最大页数
          var maxPages = 15;
          // 默认起始页为第1页
          var $i = 1;
          // 计数器
          var $j = 0;

          // 如果当前页距总页数大于最大页数，起始页改为当前页
          if ($scope.pageCount - $scope.pageIndex >= maxPages) {
            $i = $scope.pageIndex; 
          } else if ($scope.pageCount > maxPages) {
            // 否则，如果总页数大于最大页数
            $i = $scope.pageCount - maxPages + 1;
          }

          for ($i; $i <= $scope.pageCount; $i++) {
            if ($i == $scope.pageIndex) {
              // 如果是当前页，高亮
              $scope.htmlPaging += '<li class="active">';
            } else {
              $scope.htmlPaging += '<li>';
            }
            $scope.htmlPaging += ('<a href="javascript:" ng-click="gotoPage(' + $i + ');">' + $i + '</a></li>');

            // 最多显示15页
            $j++;
            if ($j >= 15) {
              break;
            }
          }

          // 如果当前是最后一页，下一页不可用
          if ($scope.pageIndex < $scope.pageCount) {
            $scope.htmlPaging += '<li class="next"><a href="javascript:" ng-click="gotoPage(' + ($scope.pageIndex + 1) + ');"><i class="fa fa-angle-right fa-lg"></i></a></li>';
            $scope.htmlPaging += '<li class="next"><a href="javascript:" ng-click="gotoPage(' + $scope.pageCount + ');"><i class="fa fa-angle-double-right fa-lg"></i></a></li>';
          } else {
            $scope.htmlPaging += '<li class="next disabled"><a href="javascript:"><i class="fa fa-angle-right fa-lg"></i></a></li>';
            $scope.htmlPaging += '<li class="next disabled"><a href="javascript:"><i class="fa fa-angle-double-right fa-lg"></i></a></li>';
          }

          $scope.htmlPaging += '</ul>';

          $element.find('#paging').html($compile($scope.htmlPaging)($scope));
        } else {
          $element.find('#paging').html('');
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
