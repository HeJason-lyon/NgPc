angular.module('MyApp')
    .directive('myProgress',['$timeout' ,function ($timeout) {
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
    }])