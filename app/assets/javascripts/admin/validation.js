app.factory('validation', [function() {
  'use strict';

  // 高亮输入错误的文本框
  var setStyle = function(editForm, err) {
    // 更改样式为错误，并定位焦点
    editForm.parent().removeClass('has-success');
    editForm.parent().addClass('has-error');
    editForm.focus();

    // 重新绑定blur事件，如果有值则替换样式为成功
    editForm.off('blur');
    editForm.on('blur', function(){
      if (editForm.val().trim().length > 0) {
        editForm.parent().removeClass('has-error');
        editForm.parent().addClass('has-success');
      } else {
        editForm.parent().removeClass('has-success');
        editForm.parent().addClass('has-error');
      }
    });
  };

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
            setStyle(control);
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

          if (isNaN(parseFloat(value))) {
            setStyle(control);
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
