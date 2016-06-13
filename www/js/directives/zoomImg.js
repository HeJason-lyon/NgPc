angular.module('MyApp')
    .directive('zoomImage', ['$ionicGesture', function ($ionicGesture) {
        return {
            controller: function ($scope, $element, $attrs, $transclude) {
                $scope.isBig = false;
            },
            restrict: 'A', 
            link: function ($scope, iElm, iAttrs, controller) {
                $ionicGesture.on('tap', function (e) {
                    var myEle = angular.element(iElm[0]);
                    myEle.toggleClass('big-img');
                }, iElm);
            }
        };
    }])