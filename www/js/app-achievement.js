angular.module('MyApp', ['ionic', 'mobiscroll-datetime','xiaoniu.ctrl', 'xiaoniu.services'])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider',function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        //注入拦截器
        $httpProvider.interceptors.push('myInterceptor');
        $ionicConfigProvider.views.maxCache(0);
        //默认路由
        $urlRouterProvider.otherwise("achievement/ProductsAppoin//booking");
        //路由状态
        $stateProvider
            //业绩导航条
            .state('achievement', {
                url: '/achievement/:type/:schemaId',
                abstract: true,
                templateUrl: 'ecp-wx/templates/tab-achievement.html',
                controller: 'tabsCtrl'
            })
            //业绩-产品预约
            .state('achievement.booking', {
                url: '/booking',
                views: {
                    'achievement-booking': {
                        templateUrl: 'ecp-wx/templates/tab-achievement-booking.html',
                        // controller: 'bookingCtrl'
                    }
                }
            })
            //业绩-渠道费用
            .state('achievement.cost', {
                url: '/cost',
                views: {
                    'achievement-cost': {
                        templateUrl: 'ecp-wx/templates/tab-achievement-cost.html',
                        // controller: 'costCtrl'
                    }
                }
            })
            //第一种业绩表单/应用于产品预约和渠道费用
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

            // //业绩-产品
            .state('achievement.product', {
                url: '/product',
                views: {
                    'achievement-product': {
                        templateUrl: 'ecp-wx/templates/tab-achievement-product.html',
                        // controller: 'productCtrl'
                    }
                }
            })
            // //第二种业绩表单/应用于产品预约和渠道费用
            .state('achievementformsecond', {
                url: '/achievementformsecond/:entityId/:formType',
                templateUrl: 'ecp-wx/templates/achievementformsecond-form.html',
            })
            .state('achievementformsecond.baseInfo', {
                url: '/baseInfo',
                views: {
                    'achievementformsecond-baseInfo': {
                        templateUrl: 'ecp-wx/templates/tabs-baseInfo.html',
                        controller: 'addDataCtrl'
                    }
                }
            })
            .state('achievementformsecond.introduce', {
                url: '/introduce',
                views: {
                    'achievementformsecond-introduce': {
                        templateUrl: 'ecp-wx/templates/achievementformsecond-introduce.html',
                        controller: 'introduceCtrl as vm'
                    }
                }
            })

            // //业绩-业绩管理
            .state('achievement.administration', {
                url: '/administration',
                views: {
                    'achievement-administration': {
                        templateUrl: 'ecp-wx/templates/tab-achievement-administration.html',
                        // controller : 'productAdminCtrl'
                    }
                }
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



            //数据新增
            .state('addData', {
                url: '/addData/:entityId/:formType/:typeName/:unitId',
                templateUrl: 'ecp-wx/templates/add-data.html',
                controller: 'addDataCtrl'
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