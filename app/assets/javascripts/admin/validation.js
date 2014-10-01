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
    }
  };
}]);
