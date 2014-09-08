// emacs: -*- coding: utf-8; js-indent-level: 2; -*- vi: set ai ts=2 sw=2 sts=2 et:
// angular列表页基类

app.controller('BaseListController', ['$scope', '$compile', '$element', 'BaseController', function($scope, $compile, $element, BaseController) {
  $scope.selection = {};
  BaseController.extend($scope, $element);

  // read 返回结果
  $scope.$on('afterRead', function(event, response) {
    $scope.flagAfterItemCreated = true;
    $scope.flagAfterItemUpdated = true;
    $scope.flagAfterItemDeleted = true;

    // 控制器，方法，主键
    $scope.controller = response.controller;
    if ($scope.controller == undefined) {
      $scope.controller = Util.getController();
    }
    $scope.method = response.method;
    if ($scope.method == undefined) {
      $scope.method = Util.getMethod();
    }
    $scope.primaryKey = response.primaryKey;
    if ($scope.primaryKey == undefined) {
      $scope.primaryKey = 'id';
    }

    // 列表
    $scope.list = response.list;
    $scope.selection = {};
    $scope.batchDeleteDisabled.value = true;

    // 搜索条件
    $scope.searchCondition = response.search_condition;
    angular.forEach($scope.searchCondition, function(value, key) {
      $scope[key] = value;
    });

    // 分页信息
    $scope.rowCount = parseInt(response.list.total);
    $scope.pageSize = parseInt(response.list.per_page);
    $scope.pageCount = parseInt(response.list.last_page);
    $scope.pageIndex = parseInt(response.list.current_page);

    $scope.paging();
    $scope.$broadcast('afterListGenerated', response);
  });

  // 已添加
  $scope.$on('afterItemCreated', function(event, item) {
    if ($scope.list !== undefined) {
      $scope.list.data.unshift(item);
    }
    // 更新关联字段
    if (!angular.isUndefined($scope.relation) && $scope.flagAfterItemCreated) {
      $scope.init();
    }
  });
  // 成功后通过回调关闭编辑界面
  $scope.$on('afterItemCreated', function(event, data){
    $scope.closeEdit();
  });

  // 已更新
  $scope.$on('afterItemUpdated', function(event, item) {
    for(var key in $scope.itemModel) {
      $scope.editingItem[key] = $scope.itemModel[key];
    }
    
    // 更新关联字段
    if (!angular.isUndefined($scope.relation) && $scope.flagAfterItemUpdated) {
      $scope.init();
    }
  });
  // 更新成功后通过回调关闭编辑界面
  $scope.$on('afterItemUpdated', function(event, data){
    $scope.closeEdit();
  });

  // 已删除
  $scope.$on('afterItemDeleted', function(event, item) {
    // 删除则从数组中删除对应项，并重新索引数组
    index = $scope.list.data.indexOf(item);
    $scope.list.data.splice(index, 1);
  });
  
  // 列表数据已读取
  $scope.$on('afterListGenerated', function(event, list) {
    Util.initTableTribleCheckbox();
  });

  // 关闭编辑界面
  $scope.closeEdit = function() {
    $("#panel-edit").toggleClass("in");
    $("#panel-edit").slideUp(); 
    $("#panel-list").slideDown(); 
  };

  //Esc键关闭编辑界面
  $(document).keydown(function(e) {
    if(e.keyCode == 27){
      //但页面显示编辑界面时 按Esc关闭编辑界面
      if($("#panel-list").is(":hidden")==true){
        $scope.closeEdit();
      }
    }
  });

  // item 选中状态变化
  $scope.$on('afterItemSelectChanged', function(event, item) {
    if (item.$$checked != undefined && item.$$checked == false) {
      delete $scope.selection[item.$$hashKey];
    } else {
      $scope.selection[item.$$hashKey] = item;
    }

    var length = Object.getOwnPropertyNames($scope.selection).length;

    if (length > 0) {
      $scope.batchDeleteDisabled.value = false;
    } else {
      $scope.batchDeleteDisabled.value = true;
    }
  });

  // 搜索
  $scope.search = function(keyword) {
    if (angular.isUndefined(keyword) || keyword === null) {
      keyword = '';
    }

    //$scope.read(Util.getController(), 'list', '?keyword=' + keyword);
    $scope.read(Util.getController(), 'list', '?s={"keyword": "' + keyword + '"}');
  };

  // 跳到第几页
  $scope.gotoPage = function(page) {
    var params = '?page=' + page;

    if ($scope.searchCondition !== undefined && $scope.searchCondition !== null && $scope.searchCondition !== '') {
      params += '&s={';

      var i = 0;
      for (key in $scope.searchCondition) {
        //params += '&' + key + '=' + $scope.searchCondition[key];
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
    $("#panel-list input[name=q]").on('keydown', function(e){
      if (e.keyCode == 13){
        $scope.search(this.value);
        this.select();
      }
    });
  };

  $scope.importExcel = function() {
    $("#import-excel").click();
  };

  $("#import-excel").change(function() {
    Util.showIosNotify('请稍候...');
    var formData = new FormData();
    formData.append("file", $("#import-excel")[0].files[0]);

    $.ajax({
      type: 'POST',
      url: Util.getController() + '/import_excel?_token=' + $("input[name='_token']").val(),
      data: formData,
      dataType: 'text',
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",

      success: function(response) {
        Util.hideIosNotify();
        Util.notify(response.desc);
      },
      error: function(response) {
        Util.hideIosNotify();
        Util.notify('导入失败，请检查Excel文件', 'error');
      },
      dataType: 'json'
    });
  });
}]);

// 数字转百分号
app.filter('percentage', ['$filter', function($filter) {
  return function(input, decimals) {
    return $filter('number')(input*100, decimals)+'%';
  };
}]);
