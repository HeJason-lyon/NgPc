angular.module('MyApp', ['ionic','mobiscroll-datetime',  'xiaoniu.ctrl', 'xiaoniu.services'])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider',function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        //注入拦截器
        $httpProvider.interceptors.push('myInterceptor'); 
        $urlRouterProvider.otherwise('payMoney');
        $ionicConfigProvider.views.maxCache(0);
        //路由状态
        $stateProvider
            .state('payMoney', {
                url: '/payMoney',
                templateUrl: 'ecp-wx/templates/pay-money.html',
                controller: 'payMoneyCtrl'
            })
            .state('customerform', {
                url: '/customerform/:entityId/:formType',
                templateUrl: 'ecp-wx/templates/customer-form.html',
            })
            .state('customerform.baseInfo', {
                url: '/baseInfo',
                views: {
                    'customerform-baseInfo': {
                        templateUrl: 'ecp-wx/templates/tabs-baseInfo.html',
                        controller : 'addDataCtrl'
                    }
                }
            })
            .state('customerform.achievement', {
                url: '/achievement',
                views: {
                    'customerform-achievement': {
                        templateUrl: 'ecp-wx/templates/customerform-achievement.html',
                        controller : 'customerAchievementCtrl'
                    }
                }
            })
            .state('customerform.app', {
                url: '/app',
                views: {
                    'customerform-app': {
                        templateUrl: 'ecp-wx/templates/customerform-app-achievement.html',
                        controller : 'customerAppAchievementCtrl'
                    }
                }
            })
            .state('customerform.workflow', {
                url: '/workflow',
                views: {
                    'customerform-workflow': {
                        templateUrl: 'ecp-wx/templates/tabs-workflow.html',
                        controller : 'workflowCtrl as vm'
                    }
                }
            })
            .state('addData', {
                url: '/addData/:entityId/:formType/:editId',
                templateUrl: 'ecp-wx/templates/add-data.html',
                controller: 'addDataCtrl'
            })
    }]);
