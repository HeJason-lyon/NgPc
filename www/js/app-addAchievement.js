angular.module('MyApp', ['ionic', 'mobiscroll-datetime','xiaoniu.ctrl', 'xiaoniu.services'])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider',function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        //注入拦截器
        $httpProvider.interceptors.push('myInterceptor');
        $urlRouterProvider.otherwise('addData/SalesSub');
        //路由状态
        $stateProvider
            .state('addData', {
                url: '/addData/:formType',
                templateUrl: 'ecp-wx/templates/add-data.html',
                controller: 'addDataCtrl'
            })
            .state('achievementformthird', {
                url: '/achievementformthird/:entityId/:formType',
                templateUrl: 'ecp-wx/templates/achievementformthird-form.html',
            })
            .state('achievementformthird.baseInfo', {
                url: '/achievementformthird',
                views: {
                    'achievementformthird-baseInfo': {
                        templateUrl: 'ecp-wx/templates/tabs-baseInfo.html',
                        controller: 'addDataCtrl'
                    }
                }
            })
            .state('achievementformthird.money', {
                url: '/money',
                views: {
                    'achievementformthird-money': {
                        templateUrl: 'ecp-wx/templates/achievementformthird-money.html',
                        controller: 'achieveMoneyCtrl as vm'
                    }
                }
            })
            .state('achievementformthird.integral', {
                url: '/integral',
                views: {
                    'achievementformthird-integral': {
                        templateUrl: 'ecp-wx/templates/achievementformthird-integral.html',
                        controller: 'achieveIntegralCtrl as vm'
                    }
                }
            })
            .state('achievementformthird.workflow', {
                url: '/workflow',
                views: {
                    'achievementformthird-workflow': {
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
