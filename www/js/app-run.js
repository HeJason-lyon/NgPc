//Loading的显示与否
angular.module('MyApp')
    .run(['$rootScope', '$ionicLoading', '$document', function ($rootScope, $ionicLoading, $document, $window) {
        $rootScope.$on('loading:show', function () {
            $ionicLoading.show()
        })
        $rootScope.$on('loading:hide', function () {
            $ionicLoading.hide()
        })
        //如果是IOS的话 title改变方式
        if (ionic.Platform.isIOS()) {
            $rootScope.$on('$ionicView.afterEnter', function () {
                var body = document.getElementsByTagName('body')[0];
                var iframe = document.createElement("iframe");
                iframe.title = '';
                iframe.width = 0;
                iframe.height = 0;
                iframe.setAttribute("src", "/empty.png");
                iframe.addEventListener('load', function () {
                    setTimeout(function () {
                        iframe.removeEventListener('load', function () {});
                        document.body.removeChild(iframe);
                    }, 0);
                });

                document.body.appendChild(iframe);
            });
        }

    }])