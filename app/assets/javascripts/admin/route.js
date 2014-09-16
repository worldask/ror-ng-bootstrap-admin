// emacs: -*- coding: utf-8; js-indent-level: 2; -*- vi: set ai ts=2 sw=2 sts=2 et:

var deps = ['ngAnimate', 'ngRoute'];
var app = angular.module('app', deps);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/admin/users', {
    templateUrl: '/admin/users',
    controller: 'Admin::AdminUsersController',
    controllerAs: 'users'
  })
  .when('/admin/depts', {
    templateUrl: '/admin/depts',
    controller: 'Admin::AdminDeptsController',
    controllerAs: 'depts'
  });

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
}]);

