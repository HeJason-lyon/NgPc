angular.module('MyApp', ['ionic','mobiscroll-datetime', 'xiaoniu.ctrl', 'xiaoniu.services'])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider',function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        //注入拦截器
        $httpProvider.interceptors.push('myInterceptor');   
        $urlRouterProvider.otherwise('knowledge');
        //路由状态
        $stateProvider
            .state('knowledge', {
                url: '/knowledge',
                templateUrl: 'ecp-wx/templates/knowledge.html',
                controller : 'knowledgeCtrl'
            })
            .state('knowledgeDetail',{
                url : '/knowledgeDetail/:entityId/:formType',
                templateUrl : 'ecp-wx/templates/knowledge-detail.html',
                controller : 'knowledgeDetailCtrl'
            })
    }]);
