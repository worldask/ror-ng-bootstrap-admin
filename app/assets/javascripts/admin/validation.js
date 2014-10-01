app.factory('validation', [function() {
  'use strict';

  return {
    extend: function(scope, element) {
      scope.validate = function() {
        var result = true;
        var value = '';
        var control;
        var controlName = '';

        // validate required
        var controls = $("#editForm [required]");
        for (var i = 0; i < controls.length; i++) {
          control = $(controls[i]);
          value = control.val().trim();

          if (value == '' || value == '? undefined:undefined ?' || value == '?') {
            Util.focus(control);
            if (controls[i].type == 'text') {
              controls[i].select();
            }
            controlName = control.attr("placeholder");
            if (!angular.isUndefined(controlName) && controlName != '') {
              Util.notify("请输入" + controlName, 'error');
            }

            return false;
          }
        }

        // validate numeric
        var controls = $("#editForm input[numeric]");
        for (var i = 0; i < controls.length; i++) {
          control = $(controls[i]);
          value = control.val().trim();

          if (isNaN(value)) {
            Util.focus(control);
            controls[i].select();
            controlName = control.attr("placeholder");
            if (!angular.isUndefined(controlName) && controlName != '') {
              Util.notify(controlName + "请输入数字", 'error');
            }
            return false;
          }
        }

        return result;
      };

      //  var controls = $("#editForm input[unique]");
      //  scope.uniqueCount = controls.length;

      //  if (controls.length > 0) {
      //    for (var i = 0; i < controls.length; i++) {
      //      var err = scope.checkUnique($(controls[i]),
      //        scope.itemModel[scope.primaryKey],
      //        $(controls[i]).attr('id'),
      //        $(controls[i]).val().trim());
      //    }
      //  } 

      //scope.uniqueCount = 0;

      //scope.checkUnique = function(formControl, primaryKey, model, value) {
      //  var params = '?eq={"' + model + '":"' + value + '"}';
      //  if (primaryKey != undefined && primaryKey != '') {
      //    params += '&noteq={"' + $("#primaryKey").val() + '":"' + primaryKey + '"}';
      //  }

      //  var p = $http({
      //    method: 'GET',
      //    url: Util.getController() + '/get_count' + params,
      //  });

      //  p.success(function(response) {
      //    if (response !== 0) {
      //      formControl.parent().removeClass('has-success');
      //      formControl.parent().addClass('has-error');
      //      formControl.focus();
      //      return;
      //    } else {
      //      formControl.parent().removeClass('has-error');
      //      formControl.parent().addClass('has-success');
      //    }

      //    scope.uniqueCount -= 1;

      //    if (scope.uniqueCount <= 0) {
      //      Util.showIosNotify('Loading...');
      //      scope.saveCommit();
      //    }
      //  });
      //}

    }
  };
}]);
