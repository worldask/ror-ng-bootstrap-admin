app.directive('pagination', ['$compile', function($compile) {
  function link(scope, element, attrs) {
    var generateHtml = function() {
      var html = '';

      if (attrs.lastPage > 1) {
        html += '<ul class="pagination">';

        // if first page, disable first && previous
        if (attrs.page > 1) {
          html += '<li class="prev"><a href="javascript:" ng-click="gotoPage(1);"><i class="fa fa-angle-double-left fa-lg"></i></a></li>';
          html += '<li class="prev"><a href="javascript:" ng-click="gotoPage(' + (parseInt(attrs.page) - 1) + ');"><i class="fa fa-angle-left fa-lg"></i></a></li>';
        } else {
          html += '<li class="prev disabled"><a href="javascript:"><i class="fa fa-angle-double-left fa-lg"></i></a></li>';
          html += '<li class="prev disabled"><a href="javascript:"><i class="fa fa-angle-left fa-lg"></i></a></li>';
        }

        var maxPages = 15;
        // start page default to first page
        var $i = 1;
        // counter
        var $j = 0;

        // if last page minus current page is greater than maxPages, using current page as start page
        if (attrs.lastPage - attrs.page >= maxPages) {
          $i = attrs.page; 
        } else if (attrs.lastPage > maxPages) {
          // if last page is greater than maxPages
          $i = attrs.lastPage - maxPages + 1;
        }

        for ($i; $i <= attrs.lastPage; $i++) {
          if ($i == attrs.page) {
            // hightlight current page
            html += '<li class="active">';
          } else {
            html += '<li>';
          }
          html += ('<a href="javascript:" ng-click="gotoPage(' + $i + ');">' + $i + '</a></li>');

          $j++;
          if ($j >= maxPages) {
            break;
          }
        }

        // if current page is the last page, disable next page & last page
        if (attrs.page < attrs.lastPage) {
          html += '<li class="next"><a href="javascript:" ng-click="gotoPage(' + (parseInt(attrs.page) + 1) + ');"><i class="fa fa-angle-right fa-lg"></i></a></li>';
          html += '<li class="next"><a href="javascript:" ng-click="gotoPage(' + attrs.lastPage + ');"><i class="fa fa-angle-double-right fa-lg"></i></a></li>';
        } else {
          html += '<li class="next disabled"><a href="javascript:"><i class="fa fa-angle-right fa-lg"></i></a></li>';
          html += '<li class="next disabled"><a href="javascript:"><i class="fa fa-angle-double-right fa-lg"></i></a></li>';
        }

        html += '</ul>';

        element.html($compile(html)(scope));
      } else {
        element.html('');
      }
    };

    scope.gotoPage = function(page) {
      var params = '?page=' + page;

      if (angular.isDefined(attrs.keyword) && attrs.keyword !== null && attrs.keyword !== '') {
        params += '&keyword=' + attrs.keyword;
      }

      // get data for specified page
      scope.read({c: Util.getController(), m: 'list', params: params});
    };

    attrs.$observe('page', generateHtml);
    attrs.$observe('lastPage', generateHtml);
  }

  return {
    restrict: "E",
    scope: {
      read: '&'
    },
    link: link
  };
}]);

// auto focus and select first textbox when open edit panel
app.directive('autoFocus', ['$timeout', function($timeout) {
  function link(scope, element, attrs) {
    var focusTo = function() {
      $timeout(function() {
        element.find('input:text')[0].focus();
        element.find('input:text')[0].select();
      }, 50);
    };
    var getClass = function() {
      return element.attr('class');
    };
    scope.$watch(getClass, focusTo);
  }

  return {
    restrict: 'AE',
    link: link
  };
}]);
