angular.module('xiaoniu.directive', [])
    .directive('myProgress', function ($timeout) {
        return {
            scope: {
                value: "@"
            },
            restrict: 'AE',
            template: '<div class="progress-out">' +
            '<div class="progress-in"></div>' +
            '</div>' +
            '<span class="col text-center progress-value orange">' +
            '{{value}}<small>%</small>' +
            '</span>' +
            '<span class="orange col text-center progress-text h4">' +
            '目标达成' +
            '</span>',
            link: function ($scope, iElm, iAttrs, controller) {
                $scope.$watch('value', function () {
                    var mValue = parseInt($scope.value) * 1.8;
                    var aimValue = mValue > 178 ? 178 : mValue;
                    var mStyle = "rotateZ(" + aimValue + "deg)";
                    // console.log($scope.value);
                    setTimeout(function () {
                        iElm.find('div').eq(1).css('-o-transform', mStyle);
                        iElm.find('div').eq(1).css('transform', mStyle);
                        iElm.find('div').eq(1).css('-webkit-transform', mStyle);
                        iElm.find('div').eq(1).css('-moz-transform', mStyle);
                        iElm.find('div').eq(1).css('-ms-transform', mStyle);
                    }, 100);
                })
            }
        };
    })
    .directive('orderList', function () {
        return {
            controller: function ($scope, $element, $attrs, $transclude) {
                var lists = [];
                this.getOpened = function (selectedItem) {
                    angular.forEach(lists, function (item, key) {
                        if (selectedItem != item) {
                            item.showMe = false;
                        }
                    });
                }
                this.addItem = function (item) {
                    lists.push(item);
                }
            },
            restrict: 'AE',
            template: '<ul class="list" ng-transclude></ul>',
            replace: true,
            transclude: true,
            link: function ($scope, iElm, iAttrs, controller) { }
        };
    })
    .directive('orderListItem', function () {
        return {
            scope: {
                orderVaule: '=',
                orderReverse: '=',
                orderPredicate: '=',
                iconUp: '@',
                iconDown: '@',
            },
            controller: function ($scope, $element, $attrs, $transclude) { },
            require: '?^orderList',
            restrict: 'AE',
            template: '<li class="item item-icon-right" ng-click="toogle(orderVaule)">' +
            '<span ng-transclude></span>' +
            '<i ng-show="showMe" ng-class="{true:\'{{iconUp}}\',false:\'{{iconDown}}\'}[orderReverse]"></i>' +
            '</li>',
            transclude: true,
            link: function ($scope, iElm, iAttrs, controller) {
                $scope.showMe = false;
                controller.addItem($scope);
                $scope.toogle = function (value) {
                    $scope.orderReverse = !$scope.orderReverse;
                    $scope.orderPredicate = value;
                    $scope.showMe = true;
                    controller.getOpened($scope);
                }
            }
        };
    })
    .directive('autoTextare', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            require: '^?ngModel',
            link: function ($scope, iElm, iAttrs, controller) {
                var nowEle = angular.element(iElm[0]);
                $timeout(function () {
                    nowEle.css('height', 'auto');
                    nowEle.css('height', iElm[0].scrollHeight + 'px');
                }, 100)
                iElm.on('input', function (event) {
                    nowEle.css('height', 'auto');
                    nowEle.css('height', this.scrollHeight + 'px');
                })
            }
        }
    }])
    .directive('changeVerify', function () {
        return {
            restrict: 'A',
            link: function ($scope, iElm, iAttrs, controller) {
                var mImg = angular.element(iElm[0]);
                var mSrc = iAttrs.src;
                var date;
                iElm.on('touchstart', function () {
                    date = new Date().getTime();
                    mImg.attr('src', mSrc + "?t=" + date);
                })
            }
        };
    })
    .directive('zoomImage', ['$ionicGesture', '$timeout', function ($ionicGesture, $timeout) {
        return {
            controller: function ($scope, $element, $attrs, $transclude) {
                $scope.isBig = false;
            },
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function ($scope, iElm, iAttrs, controller) {
                $ionicGesture.on('tap', function (e) {
                    var myEle = angular.element(iElm[0]);
                    myEle.toggleClass('big-img');
                }, iElm);
            }
        };
    }])