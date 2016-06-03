
//Please set step content to fixed width when complex content or dynamic loading.
angular.module('com.github.greengerong.backdrop', [])
    .directive('uiBackdrop', ['$document', function ($document) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'modal-backdrop.html',
            scope: {
                backdropClass: '=',
                zIndex: '='
            }
            /* ,link: function(){
               $document.bind('keydown', function(evt){
                 evt.preventDefault();
                 evt.stopPropagation();
               });
               
               scope.$on('$destroy', function(){
                 $document.unbind('keydown');
               });
             }*/
        };
    }])
    .service('modalBackdropService', ['$rootScope', '$compile', '$document', function ($rootScope, $compile, $document) {
        var self = this;

        self.backdrop = function (backdropClass, zIndex) {
            var $backdrop = angular.element('<ui-backdrop></ui-backdrop>')
                .attr({
                    'backdrop-class': 'backdropClass',
                    'z-index': 'zIndex'
                });

            var backdropScope = $rootScope.$new(true);
            backdropScope.backdropClass = backdropClass;
            backdropScope.zIndex = zIndex;
            $document.find('body').append($compile($backdrop)(backdropScope));

            return function () {
                $backdrop.remove();
                backdropScope.$destroy();
            };
        };
    }]);

angular.module('com.github.greengerong.trainning', ['com.github.greengerong.backdrop', 'ui.bootstrap'])
    .directive('trainningStep', ['$timeout', '$http', '$templateCache', '$compile', '$uibPosition', '$injector', '$window', '$q', '$controller', function ($timeout, $http, $templateCache, $compile, $uibPosition, $injector, $window, $q, $controller) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'trainning-step.html',
            scope: {
                step: '=',
                trainnings: '=',
                nextStep: '&',
                cancel: '&'
            },
            link: function (stepPanelScope, elm) {
                var stepPanel = elm.find('.step-panel');
                stepPanelScope.$watch('step', function (step) {
                    if (!step) {
                        return;
                    }

                    stepPanelScope.currentTrainning = stepPanelScope.trainnings[stepPanelScope.step - 1];

                    var contentScope = stepPanelScope.$new(false);
                    loadStepContent(contentScope, {
                        'currentStep': stepPanelScope.step,
                        'trainnings': stepPanelScope.trainnings,
                        'currentTrainning': stepPanelScope.currentTrainning,
                        'trainningInstance': {
                            'nextStep': stepPanelScope.nextStep,
                            'cancel': stepPanelScope.cancel
                        }
                    }).then(function (tplAndVars) {
                        elm.find('.popover-content').html($compile(tplAndVars[0])(contentScope));
                    }).then(function () {
                        var pos = stepPanelScope.currentTrainning.position;
                        adjustPosition(stepPanelScope, stepPanel, pos);
                    });

                });

                angular.element($window).bind('resize', function () {
                    adjustPosition(stepPanelScope, stepPanel, stepPanelScope.currentTrainning.position);
                });

                stepPanelScope.$on('$destroy', function () {
                    angular.element($window).unbind('resize');
                });

                function getPositionOnElement(stepScope, setpPos) {
                    return $uibPosition.positionElements(angular.element(setpPos), stepPanel, stepScope.currentTrainning.placement, true);
                }

                function positionOnElement(stepScope, setpPos) {
                    var targetPos = angular.isString(setpPos) ? getPositionOnElement(stepScope, setpPos) : setpPos;
                    var positionStyle = stepScope.currentTrainning || {};
                    positionStyle.top = targetPos.top + 'px';
                    positionStyle.left = targetPos.left + 'px';
                    stepScope.positionStyle = positionStyle;
                }

                function adjustPosition(stepScope, stepPanel, pos) {
                    if (!pos) {
                        return;
                    }

                    var setpPos = angular.isFunction(pos) || angular.isArray(pos) ? $injector.invoke(pos, null, {
                        trainnings: stepScope.trainnings,
                        step: stepScope.setp,
                        currentTrainning: stepScope.currentTrainning,
                        stepPanel: stepPanel
                    }) : pos;

                    //get postion should wait for content setup
                    $timeout(function () {
                        positionOnElement(stepScope, setpPos);
                    });
                }

                function loadStepContent(contentScope, ctrlLocals) {
                    var trainningOptions = contentScope.currentTrainning,
                        getTemplatePromise = function (options) {
                            return options.template ? $q.when(options.template) :
                                $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl, {
                                    cache: $templateCache
                                }).then(function (result) {
                                    return result.data;
                                });
                        },

                        getResolvePromises = function (resolves) {
                            var promisesArr = [];
                            angular.forEach(resolves, function (value) {
                                if (angular.isFunction(value) || angular.isArray(value)) {
                                    promisesArr.push($q.when($injector.invoke(value)));
                                }
                            });
                            return promisesArr;
                        },

                        controllerLoader = function (trainningOptions, trainningScope, ctrlLocals, tplAndVars) {
                            var ctrlInstance;
                            ctrlLocals = angular.extend({}, ctrlLocals || {}, trainningOptions.locals || {});
                            var resolveIter = 1;

                            if (trainningOptions.controller) {
                                ctrlLocals.$scope = trainningScope;
                                angular.forEach(trainningOptions.resolve, function (value, key) {
                                    ctrlLocals[key] = tplAndVars[resolveIter++];
                                });

                                ctrlInstance = $controller(trainningOptions.controller, ctrlLocals);
                                if (trainningOptions.controllerAs) {
                                    trainningScope[trainningOptions.controllerAs] = ctrlInstance;
                                }
                            }

                            return trainningScope;
                        };

                    var templateAndResolvePromise = $q.all([getTemplatePromise(trainningOptions)].concat(getResolvePromises(trainningOptions.resolve || {})));
                    return templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
                        controllerLoader(trainningOptions, contentScope, ctrlLocals, tplAndVars);
                        return tplAndVars;
                    });
                }

            }
        };
    }])
    .service('trainningService', ['$compile', '$rootScope', '$document', '$q', function ($compile, $rootScope, $document, $q) {
        var self = this;

        self.trainning = function (trainnings) {
            var trainningScope = $rootScope.$new(true),
                defer = $q.defer(),
                $stepElm = angular.element('<trainning-step></trainning-step>')
                    .attr({
                        'step': 'step',
                        'trainnings': 'trainnings',
                        'next-step': 'nextStep($event, step);',
                        'cancel': 'cancel($event, step)'
                    }),
                destroyTrainningPanel = function () {
                    if (trainningScope) {
                        $stepElm.remove();
                        trainningScope.$destroy();
                    }
                };

            trainningScope.cancel = function ($event, step) {
                defer.reject('cancel');
            };

            trainningScope.nextStep = function ($event, step) {
                if (trainningScope.step === trainnings.length) {
                    destroyTrainningPanel();
                    return defer.resolve('done');
                }

                trainningScope.step++;
            };
            trainningScope.trainnings = trainnings;
            trainningScope.step = 1;

            $document.find('body').append($compile($stepElm)(trainningScope));
            trainningScope.$on('$locationChangeStart', destroyTrainningPanel);

            return {
                done: function (func) {
                    defer.promise.then(func);
                    return this;
                },
                cancel: function (func) {
                    defer.promise.then(null, func);
                    return this;
                }
            };
        };

    }]);

angular.module('com.github.greengerong', ['com.github.greengerong.trainning'])
    // .filter('range', [function () {
    //     return function (len) {
    //         return _.range(1, len + 1);
    //     };
    // }])
    .controller('StepPanelController', ['currentStep', 'trainnings', 'trainningInstance', 'trainnings', function (currentStep, trainnings, trainningInstance, trainnings) {
        var vm = this;
        vm.currentStep = currentStep;
        vm.trainningInstance = trainningInstance;
        vm.trainnings = trainnings;
        vm.texts = ['Write your own sort blog.', 'Click button to public your blog.', 'View your blog info on there.', 'Click this button, you can restart this trainning when .', 'All trainnings done!'];
        return vm;
    }])
    .constant('trainningCourses', {
        courses: [{
            title: 'Step 1:',
            templateUrl: 'trainning-content.html',
            controller: 'StepPanelController',
            controllerAs: 'stepPanel',
            placement: 'left',
            position: '#blogControl'
        }, {
                title: 'Step 2:',
                templateUrl: 'trainning-content.html',
                controller: 'StepPanelController',
                controllerAs: 'stepPanel',
                placement: 'right',
                backdrop: false,
                position: '#submitBlog'
            }, {
                title: 'Step 3:',
                templateUrl: 'trainning-content.html',
                controller: 'StepPanelController',
                controllerAs: 'stepPanel',
                placement: 'top',
                position: {
                    top: 200,
                    left: 100
                }
            }, {
                title: 'Step 4:',
                templateUrl: 'trainning-content.html',
                controller: 'StepPanelController',
                controllerAs: 'stepPanel',
                placement: 'bottom',
                position: '#startAgain'
            }, {
                stepClass: 'last-step',
                backdropClass: 'last-backdrop',
                templateUrl: 'trainning-content-done.html',
                controller: 'StepPanelController',
                controllerAs: 'stepPanel',
                position: ['$window', 'stepPanel', function ($window, stepPanel) {
                    var win = angular.element($window);
                    return {
                        top: (win.height() - stepPanel.height()) / 2,
                        left: (win.width() - stepPanel.width()) / 2
                    }
                }]
            }]
    })
    .controller('DemoController', ['trainningService', 'trainningCourses', 'modalBackdropService', function (trainningService, trainningCourses, modalBackdropService) {
        var vm = this;
        vm.trainning = function () {
            //call this service should wait your really document ready event.
            trainningService.trainning(trainningCourses.courses)
                .done(function () {
                    vm.isDone = true;
                });
        };

        var backdropInstance = angular.noop;
        vm.backdrop = function () {
            modalBackdropService.backdrop();
        };

        vm.trainning();
        return vm;
    }]);
