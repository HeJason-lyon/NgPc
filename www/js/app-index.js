angular.module('MyApp', ['xiaoniu.ctrl', 'xiaoniu.services','ionic','ngCookies'])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider',function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        //注入拦截器
        $httpProvider.interceptors.push('myInterceptor');
        //默认路由
        $urlRouterProvider.otherwise('index/qy');
        //路由状态
        $stateProvider
            .state('index', {
                url: '/index/:type',
                templateUrl: 'ecp-wx/templates/tab-index.html',
                controller: "indexCtrl"
            })
            .state('customer', {
                url: '/customer',
                abstract: true,
                templateUrl: 'ecp-wx/templates/tab-customer.html',
            })
            .state('aboutMe', {
                url: '/aboutMe/:entityId/:loginName/:isLogOut',
                templateUrl: 'ecp-wx/templates/about-me.html',
                controller: 'aboutMeCtrl',
            })
            .state('knowledge', {
                url: '/knowledge',
                templateUrl: 'ecp-wx/templates/knowledge.html',
            })
            .state('changePassword', {
                url: '/changePassword/:loginName',
                templateUrl: 'ecp-wx/templates/change-password.html',
                controller: 'changePassowrdCtrl',
            })
            .state('query', {
                url: '/query',
                templateUrl: 'ecp-wx/templates/query.html',
                controller: 'queryCtrl'
            })
            .state('fastMenu', {
                url: '/fastMenu',
                templateUrl: 'ecp-wx/templates/fast-menu.html',
                controller: 'fastMenuCtrl'
            })
            .state('addData', {
                url: '/addData',
                templateUrl: 'ecp-wx/templates/add-data.html',
                controller: 'addDataCtrl',
            });
    }])
