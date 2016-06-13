angular.module('MyApp', ['ionic', 'mobiscroll-datetime', 'mobiscroll-calendar', 'xiaoniu.ctrl', 'xiaoniu.services'])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider',function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        //注入拦截器
        $httpProvider.interceptors.push('myInterceptor');
        $urlRouterProvider.otherwise('followUp/false');
        //路由状态
        $stateProvider
            .state('followUp', {
                url: '/followUp/:isLoad',
                views:
                {
                    '@': {
                        templateUrl: 'ecp-wx/templates/follow-up.html',
                        controller: 'followUpCtrl'
                    }
                }

            })
            .state('followUp.addData', {
                url: '/addData/:entityId/:formType',
                views: {
                    '@': {
                        templateUrl: 'ecp-wx/templates/add-data.html',
                        controller: 'addDataCtrl'
                    }
                }
            });
    }]);
