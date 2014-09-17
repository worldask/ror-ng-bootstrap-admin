// 树控件基类
deps.push.apply(deps, ['angularBootstrapNavTree']);

app.controller('BaseTreeController', ['$scope', '$element', '$http', 'crud', function($scope, $element, $http, crud) {
  crud.extend($scope, $element);

  // 树节点搜索函数实现
  var _search = function(root, keyword) {
    var child_ary = [];

    for (var key in root) {
      if (root[key].children !== undefined && root[key].children.length > 0) {
        var child_found = _search(root[key].children, keyword);
        if (child_found.length > 0) {
          var parent_temp = angular.copy(root[key]); // 此处需拷贝，否则改变原有的树结构
          parent_temp.children = child_found;
          parent_temp.expanded = true;
          child_ary.push(parent_temp);
        }
      } else {
        if ($scope.isMatch(root[key], keyword)) {
          child_ary.push(root[key]);
        }
      }
    }

    return child_ary;
  };

  // 遍历树添加子节点
  var _append = function(node, refNode, newNode) {
    var i;
    for (i = 0; i < node.length; i++) {
      if (parseInt(refNode.level) >= parseInt(node[i].level)) {
        if (node[i].id === refNode.parent_id) {
          node[i].children.push(newNode);
          return true;
        } else  if (node[i].children !== undefined && node[i].children.length > 0) {
          return _append(node[i].children, refNode, newNode) 
        }
      }
    }

    //return false;
  };

  // 树节点移除函数实现
  var _remove = function(root, node) {
    for (var key in root) {
      if (root[key].id === node.id) {
        root.splice(key, 1);
        return true;
      } else {
        if (root[key].children !== undefined && root[key].children.length > 0) {
          if (_remove(root[key].children, node)) {
            return true;
          }
        }
      }
    }

    return false;
  };

  /*************************************************************************
   * 公有成员
   *************************************************************************/

  $scope.data = [];           // 树节点数据
  $scope.categoryCode = '';   // 目录代码
  $scope.search = {};         // 树节点搜索函数定义
  $scope.qppend = {};         // 树节点添加函数定义
  $scope.remove = {};         // 树节点移除函数定义

  // 对象与关键字是否匹配
  $scope.isMatch = function(data, keyword) {
    // 子类如需实现查找功能，请重写该函数
    return true;
  };

  // 树的初始化
  $scope.$on('baseTreeInit', function(event, data) {
    $scope.init(data.controllerName, $scope.categoryCode);
  });

  $scope.init = function(controllerName, categoryCode) {
    var urlData = '' + controllerName + '/tree';

    if (categoryCode != undefined && categoryCode !== '') {
      urlData += '&code=' + categoryCode
    }

    var p = $http({
      method : 'GET',
        url : urlData,
    });

    p.success(function(response) {
      // 标题
      if(document.title == undefined || document.title == ''){
        $scope.title = response.title;
        document.title = response.title;
      }

      // 控制器，方法，主键
      $scope.controller = response.controller;
      $scope.method = response.method;
      $scope.primaryKey = response.primaryKey;

      // 树节点搜索函数
      $scope.search = function(keyword) {
        var root = response.tree;

        // 跟节点展开
        if (root[0] !== undefined) {
          root[0].expanded = true;
        }

        if (typeof keyword === 'undefined' || keyword === '') {
          $scope.data = root;
        } else {
          $scope.data = _search(root, keyword);
        }
      };

      // 树节点添加函数
      $scope.append = function(refItem, newItem) {
        var root = response.tree;
        if (refItem.id === newItem.parent_id) {
          // 添加下级
          refItem.children.push(newItem);
        } else {
          // 添加平级
          if (!_append(root, refItem, newItem)) {
            console.log("newItem not append!");
          }
        }
      };

      // 树节点移除函数闭包
      $scope.remove = function(node) {
        var root = response.tree;
        _remove(root, node);
      };

      $scope.search(''); // 所有
      $scope.categoryCode = categoryCode;

      $scope.$broadcast('treeInited', {});
    });

    p.error(function(response) {
      console.log(response);
    });
  };
}]);
