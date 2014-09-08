// emacs: -*- coding: utf-8; js-indent-level: 2; -*- vi: set ai ts=2 sw=2 sts=2 et:

// 公用js
var Util = (function() {
  // 从地址栏获取controller参数
  var getController = function() {
    var result = location.pathname.split('/')[2];
    if (result === undefined) {
      result = "";
    } 

    return result;
  }

  // 从地址栏获取action参数
  var getMethod = function() {
    var result = location.pathname.split('/')[3];
    if (result === undefined) {
      result = "";
    } 

    return result;
  }

  // 扩展 String 类，增加 str.trim() str.ltrim() str.rtrim() 方法

  String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
  }

  String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g,"");
  }

  String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g,"");
  }

  /*
  var trim = function(str){ //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }

  var ltrim = function(str){ //删除左边的空格
    return str.replace(/(^\s*)/g,"");
  }

  var rtrim = function(str){ //删除右边的空格
    return str.replace(/(\s*$)/g,"");
  }
  */

  var getCookie = function(name) {
    var cookiePair = [], cookieArr = document.cookie.split(";");

    for ( var i = 0, len = cookieArr.length; i < len; i++) {
      if (cookieArr[i]) {
        cookiePair = cookieArr[i].split("=");

        if (cookiePair[0].trim() === name) {
          return cookiePair[1].trim();
        }
      }
    }

    return "";
  };

  // 右下角弹出通知框
  // type值可为alert success error warning information confirm 
  var notify = function(message, type) {
    if (type === undefined) {
      type = 'success';
    }

    var n = noty({
      layout: 'bottomRight',
        type: type,
        text: message,
        dismissQueue: true,
        maxVisible: 5,
        timeout: 3000,
    });
  };

  var _iosOverlay = null;

  var showIosNotify = function(text) {
    if (!_iosOverlay) {
      var opts = {
        lines: 13, // The number of lines to draw
        length: 11, // The length of each line
        width: 5, // The line thickness
        radius: 17, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#FFF', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
      };
      var target = document.createElement("div");
      document.body.appendChild(target);
      var spinner = new Spinner(opts).spin(target);
      _iosOverlay = iosOverlay({
        text: text,
                  //duration: 2e33,
                  spinner: spinner
      });
    } else {
      _iosOverlay.update({
        text:text,
      });
    }
  };

  var hideIosNotify = function(text, icon) {
    if (_iosOverlay) {
      //            _iosOverlay.update({
      //                icon: 'assets/vendor/ios-Overlay/' + icon,
      //                text: text,
      //            });

      //            window.setTimeout(function() {
      _iosOverlay.hide();
      _iosOverlay.destroy();
      _iosOverlay = null;
      //           }, 2e3);
    }
  }

  $(document).on("click", ".ios-notify-show", function(e) {
    showIosNotify('请稍候...');
    return false;
  });

  // 高亮输入错误的文本框
  var focus = function(editForm, err) {
    if (err != '') {
      // 更改样式为错误，并定位焦点
      editForm.parent().removeClass('has-success');
      editForm.parent().addClass('has-error');
      editForm.focus();

      // 重新绑定blur事件，如果有值则替换样式为成功
      editForm.off('blur');
      editForm.on('blur', function(){
        if (err != '') {
          editForm.parent().removeClass('has-error');
          editForm.parent().addClass('has-success');
        }
      });
    }
  };

  var isArray = function(objAry) {
    return Object.prototype.toString.call(objAry) === '[object Array]' ? true : false;
  };

  /**
   * 移除 HTML 标签
   * @return 纯文本
   */
  var stripHtml = function(htmlText) {
    return htmlText.replace(/<(?:.|\n)*?>/gm, '');
  };

  /**
   * 复位表格三态选择框
   * @return void
   */
  var resetTableTribleCheckbox = function() {
    var _table = $('table'); // 请勿在闭包函数中使用该变量

    _table.find('thead input:checkbox').each(function() {
      _resetTableTribleCheckbox(this);
    });
  };

  var _resetTableTribleCheckbox = function(checkAll) {
    var table = $(checkAll).closest('table');
    $(checkAll).prop("indeterminate", false);
    $(checkAll).prop("checked", false);
    table.data('checkedCount', 0);
  }

  /**
   * 初始化表格三态选择框
   * @return void
   */
  var initTableTribleCheckbox = function() {
    var _table = $('table'); // 请勿在闭包函数中使用该变量

    _table.find('thead input:checkbox').each(function() {
      _resetTableTribleCheckbox(this);
    }).off('click').on('click', function() {
      var checkAll = this;
      var table = $(checkAll).closest('table');
      var checkedCount = 0;

      table.find('tbody input:checkbox').each(function() {
        this.checked = checkAll.checked;
        $(this).triggerHandler("click");
        if (this.checked) {
          checkedCount++;
        }
      });

      table.data('checkedCount', checkedCount);
    });

    if (_table.data('checkOneBoxDelegate') === undefined) {
      _table.delegate('tbody input:checkbox', 'click', function() {
        var checkOne = this;
        var table = $(checkOne).closest('table');
        var checkAll = table.find('thead input:checkbox');
        var checkedCount = table.data('checkedCount') || 0;
        var rowCount = table.find('tbody tr').length;

        if (this.checked) {
          checkedCount++;
        } else {
          checkedCount--;
        }

        table.data('checkedCount', checkedCount);

        if (checkedCount >= rowCount) {
          checkAll.prop("indeterminate", false);
          checkAll.prop("checked", true);
        } else {
          if (checkedCount <= 0) {
            checkAll.prop("indeterminate", false);
            checkAll.prop("checked", false);
          } else {
            checkAll.prop("indeterminate", true);
          }
        }
      });

      _table.data('checkOneBoxDelegate', true);
    }
  };

  /**
   * 模态确认对话框
   * @param
   * {
   *     text    : confirm text
   *     fnOk    : ok callback
   *     fnCancel: cancel callback
   * }
   */
  var confirmModal = function(data) {
    var _modal = $('#confirmModal');
    if (_modal.length <= 0) {
      _modal = $('body').append(
          '<div class="modal fade" id="confirmModal">'
          + '    <div class="modal-dialog">'
          + '        <div class="modal-content">'
          + '            <div class="modal-header label-danger">'
          + '               <a href="#" class="close" data-dismiss="modal">&times;</a>'
          + '               <h4>提示框</h4>'
          + '            </div>'
          + '            <div class="modal-body">'
          + '                <h3 class="text-center" id="confirmText"></h3>'
          + '            </div>'
          + '            <div class="modal-footer">'
          + '                <a id="confirmModalOk" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-check fa-lg"></i></a>'
          + '                <a id="confirmModalCancel" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times fa-lg"></i></a>'
          + '            </div>'
          + '        </div>'
          + '    </div>'
          + '</div>'
          ).find('#confirmModal');
    }

    _modal.find('#confirmText').text(data.text);
    _modal.find('#confirmModalOk')
      .one('click', data.fnOK)
      .one('click', function() {
        _modal.modal('hide');
      });

    if (data.fnCancel !== undefined && data.fnCancel !== null) {
      _modal.find('#confirmModalCancel')
        .one('click', data.fnCancel)
        .one('click', function() {
          _modal.modal('hide');
        });
    }

    _modal.modal('show');
  }

  return {
    getController: getController,
    getMethod: getMethod,
    getCookie: getCookie,
    notify : notify,
    focus  : focus,
    isArray: isArray,
    stripHtml: stripHtml,
    initTableTribleCheckbox: initTableTribleCheckbox,
    resetTableTribleCheckbox: resetTableTribleCheckbox,
    showIosNotify : showIosNotify,
    hideIosNotify : hideIosNotify,
    confirmModal: confirmModal,
  };
})();
