angular.module('MyApp', [])
    .directive('dropPanel', function () {
        return {
            transclude: 'element',
            replace: true,
            template: "<div class='drop-panel'>" +
            "<span ng-transclude class='111'></span>" +
            "</div>",
            link: function (scope, el, c, d, $transclude) {
                var s = $transclude(function ngRepeatTransclude(clone, scope) {
                    console.log(scope);
                })
            }
        }
    })