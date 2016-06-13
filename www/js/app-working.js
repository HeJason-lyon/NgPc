angular.module('MyApp', ['ionic', 'mobiscroll-datetime', 'xiaoniu.ctrl', 'xiaoniu.services'])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider',function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        //注入拦截器
        $httpProvider.interceptors.push('myInterceptor');
        $ionicConfigProvider.views.maxCache(0);
        $urlRouterProvider.otherwise('working');
        //路由状态
        $stateProvider
            .state('working', {
                url: '/working',
                templateUrl: 'ecp-wx/templates/working.html',
                controller: 'workingCtrl'
            })
            .state('achievementformfirst', {
                url: '/achievementformfirst/:entityId/:formType',
                templateUrl: 'ecp-wx/templates/achievementformfirst-form.html',
            })
            .state('achievementformfirst.baseInfo', {
                url: '/baseInfo',
                views: {
                    'achievementformfirst-baseInfo': {
                        templateUrl: 'ecp-wx/templates/tabs-baseInfo.html',
                        controller: 'addDataCtrl'
                    }
                }
            })
            .state('achievementformfirst.workflow', {
                url: '/workflow',
                views: {
                    'achievementformfirst-workflow': {
                        templateUrl: 'ecp-wx/templates/tabs-workflow.html',
                        controller: 'workflowCtrl as vm'
                    }
                }
            })
            .state('workflowForm', {
                url: '/workflowForm/:typeName/:entityId/:result/:workItemId/:pageCode',
                templateUrl: 'ecp-wx/templates/workflow-form.html',
                controller: 'addDataCtrl'
            })
            .state('otherOperationForm', {
                url: '/otherOperationForm/:typeName/:pageCode/:method/:btnText/:entityId/:result/:workItemId',
                templateUrl: 'ecp-wx/templates/other-operation-form.html',
                controller: 'addDataCtrl'
            })
    }]);
