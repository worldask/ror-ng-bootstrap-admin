// 后台部门管理
app.controller('Admin::AdminDeptsController', ['$scope', '$http', '$element', 'list', function($scope, $http, $element, list) {
  list.extend($scope, $element);
}]);
