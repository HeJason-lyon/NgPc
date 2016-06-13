angular.module('MyApp', ['ionic','mobiscroll-datetime', 'xiaoniu.ctrl', 'xiaoniu.services'])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider',function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$httpProvider) {
        //注入拦截器
        $httpProvider.interceptors.push('myInterceptor'); 
        //禁止缓存
        $ionicConfigProvider.views.maxCache(0);
        //默认路由
        $urlRouterProvider.otherwise('/customer/Customer/467fffd2-777b-4791-9919-b6540e5b39b3/customerInfo');
        //路由状态
        $stateProvider
        //客户导航条
            .state('customer', {
                url: '/customer/:type/:schemaId',
                abstract: true,
                templateUrl: 'ecp-wx/templates/tab-customer.html',
                controller : 'tabsCtrl',
                
            })
            // //客户-客户档案
            .state('customer.customerInfo', {
                url: '/customerInfo',
                views: {
                    'customer-customerInfo': {
                        templateUrl: 'ecp-wx/templates/tab-customer-customerInfo.html',
                        controller: 'cutomerInfoCtrl'
                    }
                }
            })
            .state('addData', {
                url: '/addData/:entityId/:formType/:editId',
                templateUrl: 'ecp-wx/templates/add-data.html',
                controller: 'addDataCtrl'
            })
            
            // //客户-会员信息
            .state('customer.memberInfo', {
                url: '/memberInfo',
                views: {
                    'customer-memberInfo': {
                        templateUrl: 'ecp-wx/templates/tab-customer-memberInfo.html',
                    }
                }
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
                        controller : 'workflowCtrl as vm'
                    }
                }
            })
            //会员详情
            .state('memberform', {
                url: '/memberform/:entityId',
                templateUrl: 'ecp-wx/templates/memberform-form.html',
            })
            .state('memberform.baseInfo', {
                url: '/baseInfo/:formType',
                views: {
                    'memberform-baseInfo': {
                        templateUrl: 'ecp-wx/templates/tabs-baseInfo.html',
                        controller: 'addDataCtrl'
                    }
                }
            })
            .state('memberform.integral', {
                url: '/integral',
                views: {
                    'memberform-integral': {
                        templateUrl: 'ecp-wx/templates/memberform-integral.html',
                        controller: 'memberIntegralCtrl'
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
    }])