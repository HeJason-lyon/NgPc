angular.module('MyApp', ['ionic', 'mobiscroll-datetime','xiaoniu.ctrl', 'xiaoniu.services'])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider',function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        //注入拦截器
        $httpProvider.interceptors.push('myInterceptor');
        $urlRouterProvider.otherwise('addData/5aaae9f2-17b7-436a-861f-32c4377968c1/Customer');
        //路由状态
        $stateProvider
            .state('addData', {
                url: '/addData/:editId/:formType',
                templateUrl: 'ecp-wx/templates/add-data.html',
                controller: 'addDataCtrl'
            })
            //客户详情
            .state('customerform', {
                url: '/customerform/:entityId/:formType',
                templateUrl: 'ecp-wx/templates/customer-form.html',
            })
            .state('customerform.baseInfo', {
                url: '/baseInfo',
                views: {
                    'customerform-baseInfo': {
                        templateUrl: 'ecp-wx/templates/tabs-baseInfo.html',
                        controller: 'addDataCtrl'
                    }
                }
            })
            .state('customerform.achievement', {
                url: '/achievement',
                views: {
                    'customerform-achievement': {
                        templateUrl: 'ecp-wx/templates/customerform-achievement.html',
                        controller: 'customerAchievementCtrl'
                    }
                }
            })
            .state('customerform.app', {
                url: '/app',
                views: {
                    'customerform-app': {
                        templateUrl: 'ecp-wx/templates/customerform-app-achievement.html',
                        controller: 'customerAppAchievementCtrl'
                    }
                }
            })
            .state('customerform.workflow', {
                url: '/workflow',
                views: {
                    'customerform-workflow': {
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
