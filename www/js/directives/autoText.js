angular.module('MyApp')
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
    