angular.module('MyApp', ['ionic', 'ngCookies'])
    .controller('loginCtrl', ['$scope', 'loginFactory', '$window', '$ionicPopup', '$cookies', function($scope, loginFactory, $window, $ionicPopup, $cookies) {
        var expireDate = new Date();
        expireDate.setMonth(expireDate.getMonth() + 2);
        $scope.verify = "";
        $scope.userInfo = {
            loginName: $cookies.get('loginName'),
            password: '',
            verification: '',
        }
        $scope.showAlert = function(content) {
            $ionicPopup.alert({
                title: '提示',
                template: content,
                okText: '确定', // String (default: 'OK'). The text of the OK button.
                okType: 'button-orange', // String (default: 'button-positive'). The type of the OK button.
            })
        }
        
        $scope.logIn = function() {
            var redirect = $window.location.search;
            var aim = redirect.split('=')[1];
            var aimUrl = decodeURIComponent(aim);   
            $cookies.put('loginName', $scope.userInfo.loginName, { 'expires': expireDate });
            loginFactory.checkVerify($scope.userInfo.verification).then(function(data) {
                if (data.resultCode) {
                    loginFactory.logInUser($scope.userInfo).then(function(dataJson) {
                        if (!dataJson['<isError>']) {
                            $window.location.replace(aimUrl);
                        } else {
                            $scope.showAlert(dataJson.message);
                        }
                    })
                } else {
                    $scope.showAlert("验证码出错，请重新填写");
                }
            })
        }
    }])
    .service('loginFactory', ['$q', '$http', function($q, $http) {
        var deferred;
        var promise;
        return {
            logInUser: function(loginInfo) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('Ecp.OnlineUser.login.jdt', { args: loginInfo }).success(function(data) {
                    deferred.resolve(data);
                })
                return promise;
            },
            checkVerify: function(verifyInfo) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('../chkVerifyServlet', { params: { verifyCode: verifyInfo } }).success(function(data) {
                    deferred.resolve(data);
                })
                return promise;
            }
        }
    }])
    .directive('changeVerify', function() {
        return {
            restrict: 'A',
            link: function($scope, iElm, iAttrs, controller) {
                var mImg = angular.element(iElm[0]);
                var mSrc = iAttrs.src;
                var date;
                iElm.on('touchstart', function() {
                    date = new Date().getTime();
                    mImg.attr('src', mSrc + "?t=" + date);
                })
            }
        };
    })
