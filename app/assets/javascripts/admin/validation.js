app.factory('validation', ['$http', '$q', function($http, $q) {
  'use strict';

  return {
    extend: function(scope, element) {
      scope.validate = function() {
        var result = true;
        var value = '';
        var controlName = '';

        var controls = $("#editForm [required]");
        for (var i = 0; i < controls.length; i++) {
          // trim first
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
          // NAN
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

      scope.uniqueCount = 0;

      scope.checkUnique = function(formControl, primaryKey, model, value) {
        var params = '?eq={"' + model + '":"' + value + '"}';
        if (primaryKey != undefined && primaryKey != '') {
          params += '&noteq={"' + $("#primaryKey").val() + '":"' + primaryKey + '"}';
        }

        var p = $http({
          method: 'GET',
          url: Util.getController() + '/get_count' + params,
        });

        p.success(function(response) {
          if (response !== 0) {
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
            Util.showIosNotify('Loading...');
            scope.saveCommit();
          }
        });
      }

    }
  };
}]);
