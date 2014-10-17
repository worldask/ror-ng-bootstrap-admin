// 后台用户管理
app.controller('Admin::AdminUsersController', ['$scope', '$element', 'list', function($scope, $element, list) {
  list.extend($scope, $element);

  // after edit
  $scope.afterEdit.push(function() {
    if (angular.isDefined($scope.itemModel)) {
      var pattern = GeoPattern.generate($scope.itemModel.username);
      $('#avatar').css('background-image', pattern.toDataUrl());
    }
  });

  $scope.editMenu = function(item) {
    $(":checkbox[id^='treeCheckbox']").each(function(i) {
      $(this)[0].checked = false;
    });

    $("#panel-list").slideUp();
    $("#panel-menu").toggleClass("dn");
    $("#panel-menu").slideDown();

    $("#hideAdminUserID").val(item.id);
    $("#hideAdminUserName").val(item.username);

    var p = $http({
      method : 'GET',
        url : 'user/' + item.id + '/get_menu',
    });

    p.success(function(response) {
      angular.forEach(response, function(value, key) {
        $("#treeCheckbox" + value.admin_module_id)[0].checked = true;
      });
    });
  };

  // 添加保存
  $scope.$on('afterItemCreated', function(event, item){
    angular.forEach($scope.list.data, function(value, key) {
      if (value.id == item.id) {
        $scope.list.data[key].pwd = '';
      }
    });
  });

  // 编辑保存
  $scope.$on('afterItemUpdated', function(event, item) {
    angular.forEach($scope.list.data, function(value, key) {
      if (value.id == item.id) {
        $scope.list.data[key].pwd = '';
      }
    });
  });
}]);


// 菜单
app.controller('AdminModuleController', ['$scope', '$http', function($scope, $http) {
  // 选中子节点，则同时选中父节点
  $("abn-tree").on('change', 'input:checkbox', function() {
    var node = $(this).parent().parent();
    if (node.hasClass('level-2') && $(this).prop("checked") === true) {
      var prevNode = node.prev();
      while (prevNode.hasClass('level-1') === false) {
        prevNode = prevNode.prev();
      }

      prevNode.children().children('input:checkbox')[0].checked = true;
    }
  });

  $scope.save = function() {
    var data = "";
    $(":checked[id^='treeCheckbox']").each(function(i){
      //最后一个不拼接","
      data += $(this)[0].value + (($(":checked[id^='treeCheckbox']").length-1) == i ? "" : ",");
    });
    var p = $http({
      method : 'POST',
      url : 'user/' + $("#hideAdminUserID").val() + '/save_menu',
      data: {data: data, _token: $("input[name=_token]").val()},
    });
    p.success(function(response) {
      if(response == "1"){
        $("#panel-menu").toggleClass("in");
        $("#panel-menu").slideUp();
        $("#panel-list").slideDown();
        Util.notify('保存成功', 'success');
      }else{
        Util.notify('保存失败', 'error');
      }
    });
  };

  // 关闭授权界面
  $scope.closeMenu = function() {
    $("#panel-menu").toggleClass("in");
    $("#panel-menu").slideUp();
    $("#panel-list").slideDown();
  };
}]);


app.controller('UserChangePasswordController', ['$scope', '$http', function($scope, $http) {
  $scope.commit = function() {
    if (!$scope.pwdOld) {
      Util.notify('请输入旧密码', 'error');
      pwdOld.focus();
      return;
    } else if (!$scope.pwd) {
      Util.notify('请输入新密码', 'error');
      pwd.focus();
      return;
    } else if ($scope.pwd != $scope.pwd1) {
      Util.notify('新密码与确认密码必须一样', 'error');
      pwd1.focus();
      return;
    }

    var p = $http({
      method : 'POST',
      url : 'user_change_password/commit',
      data: {pwdOld: $scope.pwdOld, pwd: $scope.pwd, _token: $("input[name=_token]").val()},
    });
    p.success(function(response) {
      if(response.code == "1"){
        Util.notify(response.desc, 'success');
        $scope.pwdOld = '';
        $scope.pwd = '';
        $scope.pwd1 = '';
      }else{
        Util.notify(response.desc, 'error');
      }
    });

  }
}]);
