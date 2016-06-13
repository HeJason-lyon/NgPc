angular.module('xiaoniu.ctrl', [])
    //将时间过滤
    .filter('changeTime', function () {
        return function (input) {
            return input.split(' ')[0];
        };
    })
    //将表单数据封装成分组形式
    .filter('groupForm', function () {
        var checkArr = function (arr, value) {
            for (var i in arr) {
                if (arr[i].text == value) {
                    return true;
                }
            }
            return false;
        }
        return function (input) {
            var result = [];
            var result2 = [{
                text: "基本信息",
                child: []
            }];
            var dataJson = input.title;
            for (var i = 0; i < dataJson.length; i++) {
                var nowData = dataJson[i];
                for (var item in nowData) {
                    if (item == 'group1' && !checkArr(result, nowData[item])) {
                        result.push({
                            text: nowData[item],
                            child: []
                        });
                    } else if (item == 'group2' && !checkArr(result, nowData[item])) {
                        result.push({
                            text: nowData[item],
                            child: []
                        });
                    }
                }
                for (var l in result) {
                    if (nowData['group1'] == result[l].text && !nowData['group2']) {
                        result[l].child.push(nowData);
                    } else if (nowData['group2'] == result[l].text) {
                        result[l].child.push(nowData);
                    }
                }
            }
            if (result.length == 0) {
                for (var i = 0; i < dataJson.length; i++) {
                    result2[0].child.push(dataJson[i]);
                }
                return result2;
            } else {
                return result;
            }
        }
    })
    //动态牛查询过滤信息
    .filter('getSelectData', function () {
        return function (input, data) {
            var result = [];
            for (var i = 0; i < input.length; i++) {
                if (input[i].id != data) {
                    result.push(input[i]);
                }
            }
            return result;
        }
    })
    //业绩管理计提周期的值的变换
    .filter('changeLimit', function () {
        return function (input) {
            var result = "";
            switch (input) {
                case "1":
                    result = "年";
                    break;
                case "2":
                    result = "月"
                    break;
                case "3":
                    result = "日"
                    break;
            }
            return result;
        }
    })
    //筛选待办工作项的工作流
    .filter('getWorkingList',['IsWorkingModule',function (IsWorkingModule) {
        return function (input) {
            var result = [];
            angular.forEach(input, function (value, key) {
                if (IsWorkingModule.indexOf(value.FEntityUnitName) >= 0) {
                    result.push(value);
                }
            });
            return result;
        }
    }])
    //Index首页上面的控制器（ok）
    .controller('indexCtrl', ['$scope', '$cookies', 'indexFactory',function ($scope, $cookies, indexFactory) {
        var isFirstLoading = true;
        var isError = false;
        $scope.userInfo = [];
        $scope.menuInfo = [];
        $scope.progressValue = {
            aimValue: 0,
            nowValue: 0,
            proValue: 0,
        };
        $scope.loadData = function () {
            //快捷菜单的生成
            indexFactory.getMenuData({
                type: 'qy'
            }).then(function (dataJson) {
                $scope.menuInfo = dataJson.data.items;
                isFirstLoading = false;
            }).then(function () {
                indexFactory.getUserInfo().then(function (dataInfo) {
                    $scope.userInfo = dataInfo.data;
                });
            });
        };
        $scope.loadData();
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (!isFirstLoading && fromState.name == "fastMenu") {
                indexFactory.getMenuData({
                    type: 'qy',
                }).then(function (dataJson) {
                    $scope.menuInfo = dataJson.data.items;
                })
            } else {
                try {
                    var moveXn = $cookies.getObject('moveXn');
                    var pre = (moveXn.rate * 100).toFixed(1);
                    $scope.progressValue.aimValue = moveXn.payMoney;
                    $scope.progressValue.nowValue = moveXn.detmoney;
                    $scope.progressValue.proValue = pre;
                    $scope.progressValue.name = moveXn.name
                } catch (error) {
                    console.error('没有动态牛的数据');
                }
            }
        })
    }])
    //快捷菜单控制器（ok）
    .controller('fastMenuCtrl', ['$scope', 'indexFactory', '$state', function ($scope, indexFactory, $state) {
        var expireDate = new Date();
        var menuList = [];
        $scope.fastMenuInfo = [];
        $scope.saveData = function () {
            var options = {
                args: []
            };
            angular.forEach($scope.fastMenuInfo, function (value, key) {
                if (value.isDefaultShow == true) {
                    options.args.push({
                        url: value.url,
                        isUserShow: value.isDefaultShow
                    });
                }
            });
            indexFactory.saveMenuData(options).then(function (data) {
                $state.go('index', { type: 'qy' }, { location: 'replace' })
            })
        }
        $scope.itemClick = function (item) {
            item.isDefaultShow = !item.isDefaultShow;
        }
        $scope.loadData = function () {
            indexFactory.getMenuData({
                type: 'qy',
                isShow: true
            }).then(function (dataJson) {
                $scope.fastMenuInfo = dataJson.data.items;
            })
        }
        $scope.loadData();
    }])
    //知识库控制器（ok）
    .controller('knowledgeCtrl', ['$scope', 'knowledgeFactory', '$ionicModal', 'treeDataFactory', function ($scope, knowledgeFactory, $ionicModal, treeDataFactory) {
        $scope.knowledgeInfo = [];
        $scope.selectInfo = []
        $scope.selectInfo['mType'] = "query";
        $scope.filterLevelInfo = [];
        $scope.showFilter = false;
        $scope.search = {
            word: ''
        }

        //Moadl框操作
        $ionicModal.fromTemplateUrl('ecp-wx/templates/form-selected.html', {
            scope: $scope,
            animation: 'slide-in-up',
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.showModal = function () {
            $scope.modal.show();
        };
        $scope.hideModal = function (item) {
            $scope.modal.hide();
        };
        $scope.saveLevelInfo = function () {
            $scope.showFilter = true;
            treeDataFactory.saveLevelInfo($scope.filterLevelInfo, $scope.search.word).then(function (dataJson) {
                $scope.knowledgeInfo = dataJson.records;
            });
            $scope.hideModal();
        }
        $scope.reloadModal = function (item) {
            $scope.filterLevelInfo[item.level] = item;
            if (item.children) {
                $scope.selectInfo.data = treeDataFactory.getChildren(item);
            }
        }
        $scope.clearModalFilter = function () {
            $scope.filterLevelInfo = [];
            knowledgeFactory.getTreeData().then(function (dataInfo) {
                $scope.selectInfo.data = dataInfo.data;
            });
        }
        //主页面操作
        //清楚过滤内容
        $scope.clearFilter = function () {
            $scope.showFilter = false;
            $scope.filterLevelInfo = [];
            knowledgeFactory.getListData().then(function (dataJson) {
                $scope.knowledgeInfo = dataJson.records;
            });
        }
        //选择过滤内容
        $scope.filterData = function () {
            $scope.showModal();
            $scope.filterLevelInfo = [];
            knowledgeFactory.getTreeData().then(function (dataInfo) {
                $scope.selectInfo.data = dataInfo.data;
            });
        }
        //搜索内容
        $scope.searchData = function () {
            var knowledgeId = $scope.filterLevelInfo.length != 0 ? treeDataFactory.getLevelInfoId($scope.filterLevelInfo) : "";
            knowledgeFactory.getListData($scope.search.word, knowledgeId).then(function (dataJson) {
                $scope.knowledgeInfo = dataJson.records
            })
        }
        //事件的接收处理        
        $scope.$on('$stateChangeStart', function () {
            $scope.modal.hide();
        });
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        knowledgeFactory.getListData().then(function (dataJson) {
            $scope.knowledgeInfo = dataJson.records
        });
    }])
    //知识库详情控制器（ok）
    .controller('knowledgeDetailCtrl', ['$scope', 'addDataFactory', '$stateParams', function ($scope, addDataFactory, $stateParams) {
        var formType = $stateParams.formType;
        var entityId = $stateParams.entityId;
        $scope.knowle = {
            productName: '',
            catalog: '',
            title: '',
            kType: '',
            content: ''
        }
        addDataFactory.getFormInfo(formType, entityId).then(function (dataJson) {
            var jsonInfo = dataJson.data.formJson.data;
            var jsonDefault = dataJson.data.formJson.title;
            $scope.knowle.productName = jsonInfo.FProductId$;
            $scope.knowle.catalog = jsonInfo.FKnowledgeCatalogId$;
            $scope.knowle.title = jsonInfo.FName;
            angular.forEach(jsonDefault, function (value, key) {
                if (value.name == 'Ftype') {
                    angular.forEach(value.items, function (valueItem, keyItem) {
                        if (jsonInfo.Ftype == valueItem.value) {
                            $scope.knowle.kType = valueItem.text;
                        }
                    });
                }
            });
            $scope.knowle.content = jsonInfo.FThatProfile;
        })
    }])
    //查询信息控制器(ok)
    .controller('queryCtrl', ['$scope', '$ionicModal', 'queryFactory', 'treeDataFactory', '$state', '$filter', '$cookies', function ($scope, $ionicModal, queryFactory, treeDataFactory,  $state, $filter, $cookies) {
        var arry = [];
        var selectData = [];
        var moveXn = {};
        var isChildren = function (item) {
            for (var i = 0; i < item.length; i++) {
                if (item[i].children) {
                    return true;
                }
            }
            return false;
        }
        $scope.yearOptions = [];
        $scope.selectInfo = [];
        $scope.queryString = {
            monthId: 0,
            quarterId: "",
            year: 0,
            localId: "",
            isMonth: false,
            $department: ""
        };
        $scope.filterLevelInfo = [];
        $scope.selectInfo['mType'] = "query";
        //Modal层的操作
        $ionicModal.fromTemplateUrl('ecp-wx/templates/form-selected.html', {
            scope: $scope,
            animation: 'slide-in-up',
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.showModal = function () {
            $scope.modal.show();
        };
        $scope.hideModal = function (item) {
            $scope.modal.hide();
        };
        $scope.reloadModal = function (item) {
            $scope.filterLevelInfo[item.level] = item;
            try {
                if (!isChildren(item.children) && selectData.length != 0) {
                    console.log('no');
                    $scope.selectInfo.data = $filter('getSelectData')(selectData, item.id);
                } else if (item.children) {
                    console.log('yes');
                    $scope.selectInfo.data = item.children
                }
            } catch (e) {

            }
        }
        $scope.saveLevelInfo = function () {
            $scope.queryString.$department = treeDataFactory.getLevelInfoText($scope.filterLevelInfo);
            $scope.queryString.localId = treeDataFactory.getLevelInfoId($scope.filterLevelInfo);
            $scope.hideModal();
        }
        //主页面的操作
        $scope.selectedDepartment = function () {
            $scope.showModal();
            $scope.filterLevelInfo = [];
            queryFactory.getDepartmentInfo().then(function (dataJson) {
                console.log(dataJson);
                $scope.selectInfo.data = dataJson.data.departmentList;
                selectData = dataJson.data.selectData;
                if (dataJson.data.selectTreeData) {
                    arry = dataJson.data.selectTreeData.text.split('_');
                }
                angular.forEach(arry, function (value, key) {
                    $scope.filterLevelInfo[key] = value;
                });
            });
        }
        $scope.toggleMonth = function () {
            $scope.queryString.isMonth = !$scope.queryString.isMonth;
        }
        $scope.makeYear = function () {
            var nowYear = new Date().getFullYear();
            var startYear = nowYear - 11;
            for (startYear; startYear <= nowYear; startYear++) {
                $scope.yearOptions.push({
                    text: startYear,
                    value: startYear
                });
            }
        }
        $scope.initData = function () {
            var monthArr = ['一季度', '一季度', '一季度', '二季度', '二季度', '二季度', '三季度', '三季度', '三季度', '四季度', '四季度', '四季度']
            var nowYear = new Date().getFullYear();
            var nowMonth = new Date().getMonth();
            var nowQuarter = monthArr[nowMonth]
            $scope.queryString.quarterId = nowQuarter;
            $scope.queryString.year = nowYear;
            queryFactory.getInitDepartment().then(function (data) {
                $scope.queryString.$department = data.data.departmentName;
                $scope.queryString.localId = data.data.departmentId;
            });
        }
        $scope.searchData = function () {
            queryFactory.getSearchData($scope.queryString).then(function (dataJson) {
                moveXn.payMoney = dataJson.payMoney;
                moveXn.rate = dataJson.rate;
                moveXn.detmoney = dataJson.detmoney;
                moveXn.name = dataJson.departmentName;
                $cookies.putObject('moveXn', moveXn);
                $state.go('index');
            });
        }
        $scope.clearModalFilter = function () {
            $scope.filterLevelInfo = [];
            queryFactory.getDepartmentInfo().then(function (dataJson) {
                $scope.selectInfo.data = dataJson.data.departmentList;
                if (dataJson.data.selectTreeData) {
                    arry = dataJson.data.selectTreeData.text.split('_');
                }
                angular.forEach(arry, function (value, key) {
                    $scope.filterLevelInfo[key] = value
                });
            });
        }
        //数据变化监听
        // var watcher = $scope.$watch('queryString.isMonth', function (newValue, oldValue, scope) {
        // if ($scope.queryString.isMonth) {
        //     $scope.queryString.quarterId = "";
        // } else {
        //     $scope.queryString.monthId = 1;
        // }
        // });
        //事件接收
        // $scope.$on('$stateChangeStart', function () {
        //     $scope.modal.hide();
        //     try {
        //         watcher();
        //     } catch (e) { }
        // });
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        $scope.makeYear();
        $scope.initData();
    }])
    //待办事项控制器（ok）
    .controller('workingCtrl', ['$scope', 'workingFactory', '$state', '$filter', function ($scope, workingFactory, $state, $filter) {
        var pageIndex = 1;
        var pageCode = "";
        var tmpResult = [];
        $scope.workingInfo = [];
        $scope.hasMore = true;
        $scope.loadMore = function () {
            workingFactory.getListData(pageIndex, true).then(function (dataJson) {
                if (dataJson.data.size == 0 || !dataJson['success']) {
                    $scope.hasMore = false;
                }
                if (pageIndex == 1 && dataJson.data.size == 0) {
                    $scope.haveData = false;
                }
                tmpResult = $filter('getWorkingList')(dataJson.data.records);
                angular.forEach(tmpResult, function (value, key) {
                    $scope.workingInfo.push(value);
                })
                pageIndex++;
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.getPageCode = function (FEntityId, workItemId) {
            workingFactory.getPageCode(workItemId).then(function (dataInfo) {
                pageCode = dataInfo.args.unitCode.split('.')[1];
                $state.transitionTo('achievementformfirst.baseInfo', {
                    entityId: FEntityId,
                    formType: pageCode
                });
            });
        }
    }])
    //登录用户信息（ok）
    .controller('aboutMeCtrl', ['$scope', '$stateParams', 'aboutMeFactory', '$window', '$state','$cookies', function ($scope, $stateParams, aboutMeFactory, $window, $state,$cookies) {
        $scope.loginName = $stateParams.loginName
        $scope.userInfoDetail = [];
        $scope.logOut = function () {
            aboutMeFactory.logOut().then(function (dataJson) {
                $cookies.remove('moveXn')
                $window.location.reload();
            });
        }
        aboutMeFactory.getUserInfo($stateParams).then(function (dataJson) {
            $scope.userInfoDetail = dataJson.data.formJson.data;

        });
    }])
    //更改密码控制器(ok)
    .controller('changePassowrdCtrl', ['$scope', '$ionicPopup', '$stateParams', 'changePasswordFactory', '$window', 'aboutMeFactory', 'myAlertFactory', '$state', function ($scope, $ionicPopup, $stateParams, changePasswordFactory, $window, aboutMeFactory, myAlertFactory) {
        $scope.changePasswordInfo = {
            loginName: $stateParams.loginName,
            currentPassword: "",
            pastPassword: "",
            confirmPassword: "",
            code: "",
        }
        $scope.changePassword = function () {
            if ($scope.changePasswordInfo.confirmPassword == $scope.changePasswordInfo.currentPassword) {
                changePasswordFactory.changePassword($scope.changePasswordInfo).then(function (dataJson) {
                    if (!dataJson.data.msg) {
                        aboutMeFactory.logOut().then(function (dataJson) {
                            // myAlertFactory.showItAlert('密码修改成功,请重新登录',false,function(){
                            //     $window.location.reload();                                
                            // });   
                            myAlertFactory.showLoginAlert('密码修改成功,请重新登录');
                        });
                    } else {
                        myAlertFactory.showItAlert(dataJson.data.msg);
                    }
                });
            } else {
                myAlertFactory.showItAlert('前后两次密码不一致');
            }
        }
        $scope.getValidate = function () {
            changePasswordFactory.getValidate().then(function (data) {
                console.log(data);
                if (data.data.data.msg) {
                    myAlertFactory.showAlert(data);
                }
            });
        }
    }])
    //客户跟进系列控制器(ok)
    .controller('followUpCtrl', ['$scope', 'followUpFactory', '$filter', function ($scope, followUpFactory, $filter) {
        $scope.customerInfo = [];
        $scope.search = {
            word: ''
        }
        $scope.mycalendar;
        var nowDate = new Date();
        var nowDateLocal = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
        $scope.settings = {
            theme: 'ios',
            display: 'inline',
            layout: 'liquid',
            lang: 'zh',
            dateFormat: 'mm/dd/yy',
            swipeDirection: 'vertical',
            onDayChange: function (day, inst) {
                mdate = $filter('date')(day.date, 'yyyy-MM-dd');
                followUpFactory.getData({
                    "date": mdate
                }).then(function (dataJson) {
                    $scope.customerInfo = dataJson.data;
                });
            }
        }
        $scope.deleteItem = function (item, $index) {
            followUpFactory.deleteItem(item.FId).then(function (dataJson) {
                $scope.customerInfo.splice($index, 1);
            });
        }
        $scope.searchData = function () {
            followUpFactory.getData({
                "title": $scope.search.word
            }).then(function (dataJson) {
                $scope.customerInfo = dataJson.data;
            })
        }
        followUpFactory.getData({
            "date": nowDateLocal
        }).then(function (dataJson) {
            $scope.customerInfo = dataJson.data;
        });
    }])
    //生日客户页面的控制器（ok）
    .controller('birthdayCtrl', ['$scope', 'birthdayFactory', '$ionicLoading', function ($scope, birthdayFactory, $ionicLoading) {
        var pageIndex = 1;
        $scope.haveData = true;
        $scope.birthdayInfo = [];
        $scope.hasMore = true;
        $scope.loadMore = function () {
            birthdayFactory.getBirthdayInfo(pageIndex, true).then(function (dataJson) {
                if (dataJson.data.size == 0 || dataJson['<isError>'] || dataJson.ecode == "401") {
                    $scope.hasMore = false;
                }
                if (pageIndex == 1 && dataJson.data.size == 0) {
                    $scope.haveData = false;
                }
                angular.forEach(dataJson.data.records, function (value, key) {
                    $scope.birthdayInfo.push(value);
                })
                pageIndex++;

            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
    }])
    //付息客户页面的控制器(ok)
    .controller('payMoneyCtrl', ['$scope', 'payMoneyFactory', function ($scope, payMoneyFactory) {
        var pageIndex = 1;
        $scope.payMoneyInfo = [];
        $scope.haveData = true;
        $scope.hasMore = true;
        $scope.loadMore = function () {
            payMoneyFactory.getData(pageIndex, true).then(function (dataJson) {
                if (dataJson.data.size == 0 || dataJson['<isError>'] || dataJson.ecode == "401") {
                    $scope.hasMore = false;
                }
                if (pageIndex == 1 && dataJson.data.size == 0) {
                    $scope.haveData = false;
                }
                angular.forEach(dataJson.data.records, function (value, key) {
                    $scope.payMoneyInfo.push(value);
                })
                pageIndex++;

            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
    }])
    //业绩和客户的列表的控制器(ok)
    .controller('tabsCtrl', ['$scope', 'listDataFactory', '$stateParams', '$state', function ($scope, listDataFactory, $stateParams, $state) {
        var pageIndex = 1;
        $scope.schemaId = $stateParams.schemaId;
        $scope.orderInfo = {
            reverse: 'false',
            predicate: '',
        };
        $scope.hasMore = true;
        $scope.listData = [];
        $scope.search = {
            word: ""
        };
        $scope.loadMore = function () {
            listDataFactory.getListData($stateParams.type, $scope.search.word, pageIndex, true, $scope.orderInfo, $scope.schemaId).then(function (dataJson) {
                if (dataJson.size == 0 || dataJson['<sss>'] || dataJson.ecode == "401") {
                    $scope.hasMore = false;
                }
                if (pageIndex == 1) {
                    $scope.listData = dataJson.records
                } else {
                    angular.forEach(dataJson.records, function (value, key) {
                        $scope.listData.push(value);
                    })
                }
                pageIndex++;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            })
        }

        $scope.goCustomer = function ($event, id) {
            $event.stopPropagation();
            $state.transitionTo("customerform.baseInfo", {
                "formType": 'Customer',
                "entityId": id
            });
        }
        $scope.searchData = function () {
            $scope.schemaId = "";
            listDataFactory.getListData($stateParams.type, $scope.search.word, 1, false, $scope.orderInfo, $scope.schemaId).then(function (dataJson) {
                $scope.listData = dataJson.records;
                $scope.hasMore = true;
            })
        }
        $scope.doRefresh = function () {
            pageIndex = 1;
            $scope.hasMore = true;
            $scope.loadMore();
            $scope.$broadcast('scroll.refreshComplete');
        }
        $scope.$on('upDate', function (arg, data) {
            $scope.hasMore = true;
            $scope.listData = data.records;
        });
    }])
    //客户档案页面的控制器（ok）
    .controller('cutomerInfoCtrl', ['$scope', '$ionicPopup', 'listDataFactory', '$stateParams', 'myAlertFactory', function ($scope, $ionicPopup, listDataFactory, $stateParams, myAlertFactory) {
        var myPopup;
        $scope.isShow = false;
        $scope.toggleShow = function () {
            $scope.isShow = !$scope.isShow;
        };
        $scope.orderData = [{
            title: '投资总额',
            value: 'FTotalAmo'
        }];
        $scope.chooseCustomerType = function () {
            myPopup = $ionicPopup.show({
                template: '<a class="button button-positive button-left" ng-click="closePopup()" ui-sref="addData({formType : \'Customer\',editId:\'5aaae9f2-17b7-436a-861f-32c4377968c1\'})">个人客户</a>' +
                '<a class="button button-positive icon-center ion-camera light-bg  button-right" ng-click="scanningCustomer()"></a>' +
                '<button class="button button-positive button-left" ng-click="closePopup()" ui-sref="addData({formType : \'Customer\',editId:\'4cc9b9a5-7afb-4104-bf1c-dda293583a9f\'})" style="border-right: none !important;">机构客户</button>' +
                '<a class="button button-positive icon-center light-bg button-right" ng-click="closePopup()"  ui-sref="addData({formType : \'Customer\',editId:\'4cc9b9a5-7afb-4104-bf1c-dda293583a9f\'})"></a>',
                title: '新增客户',
                subTitle: '请选择你需要增加客户的类型',
                scope: $scope,
                buttons: [{
                    text: '取消',
                    type: 'button-assertive button-full',
                }]
            });
        };
        $scope.closePopup = function (customerTypeId) {
            myPopup.close();
        }
        $scope.scanningCustomer = function () {
            myAlertFactory.showItAlert('功能尚未开发');
        }
        $scope.$watch('orderInfo', function (newValue, oldValue, scope) {
            listDataFactory.getOrderData($stateParams.type, $scope.search.word, newValue, false, $scope.schemaId).then(function (data) {
                $scope.$emit('upDate', data, newValue)
            })
        }, true);
    }])

    //客户详情-业绩(ok)
    .controller('customerAchievementCtrl', ['$scope', 'customerAchievementFactory', '$stateParams', function ($scope, customerAchievementFactory, $stateParams) {
        $scope.dataInfo = [];
        $scope.haveData = true;
        customerAchievementFactory.getData($stateParams.entityId).then(function (dataJson) {
            if (dataJson.data.size == 0) {
                $scope.haveData = false;
            }
            $scope.dataInfo = dataJson.data.records;
        })
    }])
    //客户详情-App业绩(ok)
    .controller('customerAppAchievementCtrl', ['$scope', 'customerAppAchievementFactory', '$stateParams', function ($scope, customerAppAchievementFactory, $stateParams) {
        $scope.dataInfo = [];
        $scope.appInfo = [];
        $scope.haveData = true;
        $scope.showRecord = true;
        $scope.showAmom = true;
        $scope.toggleRecord = function () {
            $scope.showRecord = !$scope.showRecord;
        }
        $scope.toggleAmom = function () {
            $scope.showAmom = !$scope.showAmom;
        }
        customerAppAchievementFactory.getData($stateParams.entityId).then(function (dataJson) {
            $scope.dataInfo = dataJson.data.records;
        }).then(function () {
            customerAppAchievementFactory.getAppData($stateParams.entityId).then(function (data) {
                $scope.appInfo = data.data.records;
            })
        })

    }])
    //客户详情-工作流
    .controller('workflowCtrl', ['addDataFactory', '$stateParams', '$ionicPopup', 'myAlertFactory', function (addDataFactory, $stateParams, $ionicPopup, myAlertFactory) {
        var vm = this;
        var entityId = $stateParams.entityId;
        var formType = $stateParams.formType;
        vm.haveData = true;
        vm.workflowInfo = [];
        addDataFactory.getFormInfo(formType, entityId).then(function (dataInfo) {
            if (typeof dataInfo.data.workflow == 'undefined') {
                vm.haveData = false;
            } else {
                vm.workflowInfo.push(dataInfo.data.workflow.history[0])
                vm.workflowInfo.push(dataInfo.data.workflow.history[1]);
            }
        });
    }])
    //客户-积分控制器(ok)
    .controller('memberIntegralCtrl', ['$scope', 'memberIntegralFactory', '$stateParams', function ($scope, memberIntegralFactory, $stateParams) {
        $scope.listData = [];
        $scope.haveData = true;
        memberIntegralFactory.getData($stateParams.entityId).then(function (dataJson) {
            console.log(dataJson);
            $scope.haveData = dataJson.totalSize == 0 ? false : true;
            $scope.listData = dataJson.records;

        })
    }])
    //业绩-积分控制器(ok)
    .controller('achieveIntegralCtrl', ['achieveIntegralFactory', '$stateParams', function (achieveIntegralFactory, $stateParams) {
        var vm = this;
        vm.haveData = true;
        vm.listData = [];
        achieveIntegralFactory.getListData($stateParams.entityId).then(function (dataJson) {
            console.log(dataJson);
            vm.haveData = dataJson.totalSize == 0 ? false : true;
            console.log(vm.haveData);
            vm.listData = dataJson.records;
        })
    }])
    //业绩-业绩提成控制器(ok)
    .controller('achieveMoneyCtrl', ['achieveMoneyFactory', '$stateParams', function (achieveMoneyFactory, $stateParams) {
        var vm = this;
        vm.listData = [];
        vm.haveData = true;
        achieveMoneyFactory.getListData($stateParams.entityId).then(function (dataJson) {
            vm.haveData = dataJson.size == 0 ? false : true;
            vm.listData = dataJson.records;
        })
    }])
    //动态表单的控制器（ok）
    .controller('addDataCtrl', ['$scope', 'addDataFactory', '$ionicModal', '$stateParams', '$state', '$ionicActionSheet', '$ionicPopup', 'myAlertFactory', '$filter', 'IsDisable', 'IsNoDisable', function ($scope, addDataFactory, $ionicModal, $stateParams, $state, $ionicActionSheet, $ionicPopup, myAlertFactory, $filter, IsDisable, IsNoDisable) {
        var nowFormItem;
        var pageIndex = 1;
        var buttonsOptions = [];
        var workflowBtnOptions = [];
        var mUrlArgs = [];
        var modelArgs = {};
        var formType = $stateParams.formType;
        var entityId = $stateParams.entityId;
        var editId = $stateParams.editId;
        //按钮生成表单的参数
        var typeName = $stateParams.typeName;
        var pageCode = $stateParams.pageCode;
        var method = $stateParams.method;
        var btnText = $stateParams.btnText;
        var workItemId = $stateParams.workItemId;
        var result = $stateParams.result;
        var entityBoxFieldId;
        var unitId;
        var schemaId;
        var mUnitCode = "";

        $scope.hasOtherBtn = false;
        $scope.hasWorkFlowBtn = false;
        $scope.isReadOnly = false;
        //保存的参数
        $scope.saveParams = {};
        //表单的属性，渲染到页面上
        $scope.addFormInfo = [];
        //点击之后出现modal框的值
        $scope.selectInfo = [];
        $scope.search = {
            word: ''
        };
        $scope.workflowForm = [];
        $scope.workflowInfo = {
            section: "",
            comment: "",
        }
        $scope.mulitData = {}
        $scope.hasMore = true;
        $scope.confirmDisable = false;
        //Modal框操作
        $ionicModal.fromTemplateUrl('ecp-wx/templates/form-selected.html', {
            scope: $scope,
            animation: 'slide-in-up',
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.showModal = function () {
            $scope.modal.show();
        };
        $scope.hideModal = function (item) {
            $scope.modal.hide();
        };
        $scope.getModalClickData = function (item) {
            var formValue = "";
            if (item.FId) {
                //如果是存在FId，则保存值为Fid
                $scope.saveParams[nowFormItem.name] = item.FId;
                angular.forEach($scope.addFormInfo, function (mValue, mKey) {
                    angular.forEach(mValue.child, function (value, key) {
                        if (value == nowFormItem) {
                            console.log(value);
                            $scope.addFormInfo[mKey].child[key]['value'] = item.FName;
                            $scope.addFormInfo[mKey].child[key]['saveId'] = item.FId;
                        }
                    })
                });
            } else if (item.value) {
                //不存在Fid则保存值为value
                $scope.saveParams[nowFormItem.name] = item.value;
                nowFormItem['value'] = item.text;
            } else if (item.text) {
                $scope.saveParams[nowFormItem.name] = item.text;
                nowFormItem['value'] = item.text;
            }
            if (nowFormItem.linkage) {
                addDataFactory.getLinkageData(nowFormItem.linkage.fieldId, $scope.saveParams).then(function (dataInfo) {
                    console.log(dataInfo);
                    angular.forEach($scope.addFormInfo, function (mValue, mKey) {
                        angular.forEach(mValue.child, function (dataValue, dataKey) {
                            // dataValue['saveId'] = formValue;
                            angular.forEach(dataInfo.data, function (linkValue, linkKey) {

                                //是否要转换值，计提周期的特殊性
                                if (linkKey == dataValue.name && linkKey != "FLimitType") {
                                    formValue = dataInfo.data[linkKey + "$"] ? dataInfo.data[linkKey + "$"] : linkValue;
                                    dataValue['value'] = formValue;
                                    $scope.saveParams[linkKey] = linkValue;
                                } else if (dataValue.name == "FLimitType" && linkKey == "FLimitType") {
                                    formValue = $filter('changeLimit')(dataInfo.data[linkKey]);
                                    dataValue['value'] = formValue;
                                    $scope.saveParams[linkKey] = linkValue;
                                }
                            });
                        })
                    })
                })
                console.log($scope.addFormInfo);
            }

            //点击省份，清空城市数据
            if (nowFormItem.name == "FPermanentProvinces") {
                angular.forEach($scope.addFormInfo, function (mValue, mKey) {
                    angular.forEach(mValue.child, function (value, key) {
                        if (value.name == "FPermanentCity") {
                            $scope.addFormInfo[mKey].child[key]['value'] = "";
                        }
                    })
                });
            }
            if (item.text == "境外电话") {
                angular.forEach($scope.addFormInfo, function (mValue, mKey) {
                    angular.forEach(mValue.child, function (value, key) {
                        if (value.name == "FMobile") {
                            $scope.addFormInfo[mKey].child[key]['required'] = false;
                            $scope.addFormInfo[mKey].child[key]['disabled'] = true;
                        } else if (value.name == "FOutTel") {
                            $scope.addFormInfo[mKey].child[key]['required'] = true;
                            $scope.addFormInfo[mKey].child[key]['disabled'] = false;
                        }

                    })
                });
            } else if (item.text == "国内电话") {
                angular.forEach($scope.addFormInfo, function (mValue, mKey) {
                    angular.forEach(mValue.child, function (value, key) {
                        if (value.name == "FMobile") {
                            $scope.addFormInfo[mKey].child[key]['required'] = true;
                            $scope.addFormInfo[mKey].child[key]['disabled'] = false;
                        } else if (value.name == "FOutTel") {
                            $scope.addFormInfo[mKey].child[key]['required'] = false;
                            $scope.addFormInfo[mKey].child[key]['disabled'] = true;
                        }

                    })
                });
            }
            if (nowFormItem.name == "FProductId") {
                angular.forEach($scope.addFormInfo, function (mValue, mKey) {
                    angular.forEach(mValue.child, function (value, key) {
                        if (value.name == "FFType") {
                            $scope.addFormInfo[mKey].child[key]['value'] = "";
                        }
                    })
                });
            }
            $scope.hideModal();
        }
        $scope.searchSelectInfo = function () {
            if (nowFormItem.control == "EntityBox") {
                modelArgs = {
                    'keyword': $scope.search.word,
                    "entityBoxFieldId": entityBoxFieldId,
                }
                if (nowFormItem.selectListFilterFields != null) {
                    var tmpArgs = {};
                    modelArgs.form = {};
                    for (var i = 0; i < nowFormItem.selectListFilterFields.length; i++) {
                        angular.forEach($scope.addFormInfo, function (value, key) {
                            angular.forEach(value.child, function (childValue, childKey) {
                                if (nowFormItem.selectListFilterFields[i] == childValue.name) {
                                    modelArgs.form[nowFormItem.selectListFilterFields[i]] = childValue.saveId;
                                }
                            })
                        })
                    }
                }
                //单选实体单元
                addDataFactory.getSelectedInfo(nowFormItem.entityType, modelArgs).then(function (dataJson) {
                    $scope.selectInfo = dataJson;
                    $scope.selectInfo['mType'] = 'Entity';
                })
            } else {
                //多选实体单元
            }
        }
        $scope.loadMore = function () {
            if (nowFormItem.entityType) {
                pageIndex++;
                entityBoxFieldId = nowFormItem.id;
                modelArgs = {
                    'keyword': $scope.search.word,
                    'pageIndex': pageIndex,
                    "entityBoxFieldId": entityBoxFieldId,
                }
                if (nowFormItem.selectListFilterFields != null) {
                    var tmpArgs = {};
                    modelArgs.form = {};
                    for (var i = 0; i < nowFormItem.selectListFilterFields.length; i++) {
                        angular.forEach($scope.addFormInfo, function (value, key) {
                            angular.forEach(value.child, function (childValue, childKey) {
                                if (nowFormItem.selectListFilterFields[i] == childValue.name) {
                                    console.log(nowFormItem.selectListFilterFields[i]);
                                    modelArgs.form[nowFormItem.selectListFilterFields[i]] = childValue.saveId;
                                }
                            })
                        })
                    }
                }
                addDataFactory.getSelectedInfo(nowFormItem.entityType, modelArgs, true).then(function (dataJson) {
                    if (dataJson.size == 0 || dataJson['<isError>'] || dataJson.ecode == "401") {
                        $scope.hasMore = false;
                    }
                    angular.forEach(dataJson.records, function (value, key) {
                        $scope.selectInfo.records.push(value);
                    });
                    $scope.selectInfo['mType'] = 'Entity';
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            }
        }
        //多选实体框
        $ionicModal.fromTemplateUrl('ecp-wx/templates/form-mulitSelected.html', {
            scope: $scope,
            animation: 'slide-in-up',
        }).then(function (modal) {
            $scope.modal2 = modal;
        });
        $scope.showModal2 = function () {
            $scope.modal2.show();
        };
        $scope.hideModal2 = function (item) {
            $scope.modal2.hide();
        };
        $scope.updateSaveParams = function () {
            // var isAbroad = false;
            if ($stateParams.entityId && $stateParams.formType != "Channel") {
                //如果传入FId则改动数据，非新增
                $scope.saveParams['FId'] = $stateParams.entityId;
            }
            angular.forEach($scope.addFormInfo, function (value, key) {
                angular.forEach(value.child, function (rValue, rKey) {
                    //如果不是选择框的话，将文本框的内容存进将保存的数据
                    if (rValue.control != "EntityBox" && !rValue.items && rValue.control != 'CheckBox' && rValue.control != "MultiEntityBox") {
                        $scope.saveParams[rValue.name] = $scope.addFormInfo[key].child[rKey]['value']
                    }
                    // if (rValue.name == "FTelType" && rValue.value == "境外电话") {
                    //     isAbroad = true;
                    // }
                })
            })
        }
        //主页面操作
        //保存按钮
        $scope.saveData = function () {
            $scope.updateSaveParams();
            // 执行保存功能，并返回上级页面 
            addDataFactory.saveData($stateParams.formType, $scope.saveParams).then(function (data) {
                myAlertFactory.showAlert(data, '保存成功');
                if (data.entityIds) {
                    var stateName = "";
                    switch (formType) {
                        case 'SalesSub':
                            stateName = "achievementformthird";
                            break;
                        case 'ProductsAppoin':
                            stateName = "achievementformfirst"
                            break;
                        case 'Customer':
                            stateName = "customerform"
                            break;
                    }
                    try {
                        if (entityId == "") {
                            $state.go("followUp", {
                                isLoad: true
                            }, { location: 'replace' });
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    try {
                        $state.go(stateName + ".baseInfo", {
                            formType: $stateParams.formType,
                            entityId: data.entityIds[0]
                        }, { location: 'replace' });
                    } catch (e) {
                        console.log(e);
                    }

                }
            })
        }
        //多选保存功能
        $scope.saveMulitInfo = function () {
            console.log($scope.selectInfo.records);
            var mValue = "";
            var mFId = ""
            angular.forEach($scope.selectInfo.records, function (value, key) {
                if (value.checked) {
                    mValue += value.FName + " "
                    mFId += value.FId + "|";
                }
            })
            var mFId = mFId.slice(0, mFId.length - 1);
            $scope.saveParams[nowFormItem.name] = mFId;
            angular.forEach($scope.addFormInfo.title, function (value, key) {
                if (value == nowFormItem) {
                    $scope.addFormInfo.title[key]['value'] = mValue;
                }
            })
            $scope.hideModal2();
            console.log($scope.saveParams);
        }
        //生成选项
        $scope.selectedView = function (item) {
            $scope.search.word = "";
            $scope.hasMore = true;
            pageIndex = 1;
            if (!item.disabled || !isReadOnly) {
                $scope.selectInfo = []
                if (item.control == "MultiEntityBox") {
                    $scope.showModal2();
                } else {
                    $scope.showModal();
                }
                nowFormItem = item;
                if (item.entityType) {
                    entityBoxFieldId = item.id;
                    // schemaId = item.name == "FCustomerId" ? '467fffd2-777b-4791-9919-b6540e5b39b3' : "";
                    modelArgs = {
                        // schemaId: schemaId,
                        'keyword': $scope.search.word,
                        "pageIndex": pageIndex,
                        "entityBoxFieldId": entityBoxFieldId,
                    }
                    if (item.selectListFilterFields != null) {
                        var tmpArgs = {};
                        modelArgs.form = {};
                        for (var i = 0; i < item.selectListFilterFields.length; i++) {
                            angular.forEach($scope.addFormInfo, function (value, key) {
                                angular.forEach(value.child, function (childValue, childKey) {
                                    if (item.selectListFilterFields[i] == childValue.name) {
                                        modelArgs.form[item.selectListFilterFields[i]] = childValue.saveId;
                                    }
                                })
                            })
                        }

                    }
                    addDataFactory.getSelectedInfo(item.entityType, modelArgs, false).then(function (dataJson) {
                        $scope.selectInfo = dataJson;
                        $scope.selectInfo['mType'] = 'Entity';
                    });
                } else if (item.items) {
                    //当item里面存在items的时候 包括无层级机构词典、单选、多选数据等
                    $scope.selectInfo['data'] = item.items;
                    $scope.selectInfo['mType'] = 'noEntity';
                } else if (item.control == "CheckBox") {
                    //当item是选择框的时候，没有items，只有true和false
                    var items = [{
                        text: "是",
                        value: "true"
                    }, {
                            text: "否",
                            value: "false"
                        }]
                    $scope.selectInfo['data'] = items;
                    $scope.selectInfo['mType'] = 'noEntity';
                } else if (item.parentDictionaryId) {
                    if (item.name == "FPermanentProvinces") {
                        addDataFactory.getDictionaryInfo(item.dictionaryId).then(function (dataInfo) {
                            $scope.selectInfo.data = dataInfo.data;
                        });
                    } else if (item.name == "FPermanentCity") {
                        addDataFactory.getDictionaryInfo(item.dictionaryId, $scope.saveParams['FPermanentProvinces']).then(function (dataInfo) {
                            $scope.selectInfo.data = dataInfo.data;
                        });
                    }
                    $scope.selectInfo['mType'] = 'noEntity';
                }
            }
        }
        //工作流确定按钮      
        $scope.confirm = function () {
            var baseInfoArgs = {
                enableAllFields: true,
                comment: $scope.workflowInfo.comment,
                entityId: entityId,
                workItemId: workItemId,
                result: result,
                method: "",
            }
            // if ($stateParams.entityId) {
            //     //如果传入FId则改动数据，非新增
            //     $scope.saveParams['FId'] = $stateParams.entityId;
            // }
            // angular.forEach($scope.addFormInfo.child, function (value, key) {
            //     //如果不是选择框的话，将文本框的内容存进将保存的数据
            //     if (value.control != "EntityBox" && !value.items && value.control != 'CheckBox') {
            //         $scope.saveParams[value.name] = $scope.addFormInfo.child[key]['value']
            //     }
            // })
            $scope.updateSaveParams();
            if ($scope.saveParams.$isSize) {
                baseInfoArgs['form'] = $scope.saveParams;
            }
            addDataFactory.finishWorkItem(baseInfoArgs).then(function (dataJson) {
                if (location.pathname.indexOf('WorkItem.List') >= 0) {
                    myAlertFactory.showAlert(dataJson, "操作成功", false);
                    $state.go('working', null, { location: "replace" });
                } else {
                    myAlertFactory.showAlert(dataJson, "操作成功", true);
                }
            });
        }
        //生成按钮操作
        $scope.makeButton = function (mButton, urlArgs, workflowBtn) {
            buttonsOptions = mButton;
            if (urlArgs.addConfirmButton) {
                buttonsOptions.push({
                    control: "Button",
                    id: "Confirm",
                    icon: "ecp/image/button/Confirm.gif",
                    text: '确认',
                    onclick: 'EntityEdit.doConfirm',
                })
            }
            workflowBtnOptions = workflowBtn ? workflowBtn : "";
            if (!$scope.isReadOnly) {
                $scope.isReadOnly = (buttonsOptions.length == 0 && (workflowBtnOptions.length == 0)) ? true : false;
            }

            try {
                $scope.hasWorkFlowBtn = workflowBtn.length == 0 ? false : true;
            } catch (e) {
                console.log(e);
            }

        }
        //生成表单操作
        $scope.makeForm = function (mDefault, mRecord, isModal) {
            var value1;
            var isMulti;
            var isAbroad;
            //mDefault里面包含表单的内容，mRecord里面是单纯的表单信息
            angular.forEach(mDefault, function (value, key) {
                angular.forEach(mRecord, function (valueRecord, keyRecord) {
                    //如果表单信息里面的键与表单内容的键匹配，则将表单内容放入相对应的表单信息中
                    if (valueRecord['name'] == key) {
                        //如果有存在后缀$的要将文本的内容换成没有$字段的
                        value1 = mDefault[key + '$'] ? mDefault[key + '$'] : mDefault[key];
                        if (valueRecord['control'] == 'ComboBox' || valueRecord['control'] == 'MultiCheckBox') {
                            //如果是ComboBox或者是MultiCheckBox的话 items里面的text才是表单需要内容而不是value
                            angular.forEach(valueRecord.items, function (itemValue, itemKey) {
                                if (value1 == itemValue.value) {
                                    value1 = itemValue.text
                                }
                            });
                        } else if (valueRecord['control'] == "MultiEntityBox") {
                            isMulti = true;
                            var valueArry = value.split('|');
                            var mAreaValue = "";
                            var thisKey = keyRecord;
                            addDataFactory.getMultiEntityBox(valueRecord.id, valueRecord.entityType, valueArry).then(function (data) {
                                angular.forEach(data.data, function (areaValue, areaKey) {
                                    mAreaValue += areaValue.name + " ";
                                });
                                $scope.addFormInfo['title'][thisKey]['value'] = mAreaValue;
                            }).then(function () {
                                $scope.addFormInfo = $filter('groupForm')($scope.addFormInfo);

                            });
                        } else if (valueRecord['control'] == 'CheckBox') {
                            //如果是checkbox则将表单内容设置成是或否
                            //value的值是true和false
                            value1 = value ? "是" : "否";
                        } else if (valueRecord['control'] == 'EntityBox') {
                            $scope.addFormInfo['title'][keyRecord]['saveId'] = value;
                        }
                        //将表单原本有的内容放入保存变量中,并把表单内容放到表单信息
                        $scope.saveParams[valueRecord.name] = mDefault[key];
                        $scope.addFormInfo['title'][keyRecord]['value'] = value1;
                    }
                    //工作流表单的禁用状态
                    if ((typeName == "workFlowBtn" || typeName == "otherBtn") && IsDisable.indexOf(valueRecord.name) >= 0) {
                        valueRecord.disabled = true;
                    }
                    if ((typeName == "workFlowBtn" || typeName == "otherBtn") && IsNoDisable.indexOf(valueRecord.name) >= 0) {
                        valueRecord.disabled = false;
                    }
                    //立刻判断电话类型
                    if (valueRecord.name == "FTelType") {
                        if (valueRecord.value == "境外电话") {
                            isAbroad = true;
                        } else if (valueRecord.value == "国内电话") {
                            isAbroad = false;
                        }
                    }
                    if (isAbroad && valueRecord.name == "FMobile") {
                        //如果为境外电话，则国内电话表单操作 
                        valueRecord['required'] = false;
                        valueRecord['disabled'] = true;
                    } else if (isAbroad && valueRecord.name == "FOutTel") {
                        valueRecord['required'] = true;
                    } else if (isAbroad === false && valueRecord.name == "FOutTel") {
                        //如果为国内电话，则境外电话表单操作
                        valueRecord['required'] = false;
                        valueRecord['disabled'] = true;
                    }

                })
            })
            if (angular.equals(mDefault, {})) {
                angular.forEach(mRecord, function (valueRecord, keyRecord) {
                    //工作流表单的禁用状态
                    if ((typeName == "workFlowBtn" || typeName == "otherBtn") && IsDisable.indexOf(valueRecord.name) >= 0) {
                        valueRecord.disabled = true;
                    }
                    if ((typeName == "workFlowBtn" || typeName == "otherBtn") && IsNoDisable.indexOf(valueRecord.name) >= 0) {
                        valueRecord.disabled = false;
                    }
                    //立刻判断电话类型
                    if (valueRecord.name == "FTelType") {
                        if (valueRecord.value == "境外电话") {
                            isAbroad = true;
                        } else if (valueRecord.value == "国内电话") {
                            isAbroad = false;
                        }
                    }
                    if (isAbroad && valueRecord.name == "FMobile") {
                        //如果为境外电话，则国内电话表单操作 
                        valueRecord['required'] = false;
                        valueRecord['disabled'] = true;
                    } else if (isAbroad && valueRecord.name == "FOutTel") {
                        valueRecord['required'] = true;
                    } else if (isAbroad === false && valueRecord.name == "FOutTel") {
                        //如果为国内电话，则境外电话表单操作
                        valueRecord['required'] = false;
                        valueRecord['disabled'] = true;
                    }
                })
            }
            if (!isMulti) {
                $scope.addFormInfo = $filter('groupForm')($scope.addFormInfo);
            }
        }
        //进入表单则立刻执行，获取表单数据
        $scope.loadData = function () {
            var mDefault;
            var mRecord;
            var mButton;
            var urlArgs;
            var workflowBtn;
            if (typeName == "otherBtn") {
                //其他操作页面
                var args = {
                    enableAllFields: true,
                    addConfirmButton: true,
                    method: method,
                    pageTitle: btnText,
                    showWorkflow: false,
                    entityId: entityId,
                };
                addDataFactory.doOpenFormButtonClick(pageCode, args).then(function (data) {
                    $scope.addFormInfo = data.data.editJson;
                    mDefault = data.data.editJson.data;
                    mRecord = data.data.editJson.title;
                    mButton = data.data.toolBarJson.other;
                    urlArgs = data.data.urlArgs ? data.data.urlArgs : "";
                    mUnitCode = data.data.unitCode;
                    mUrlArgs = urlArgs;
                    $scope.makeForm(mDefault, mRecord);
                    $scope.makeButton(mButton, urlArgs);
                });
            } else if (typeName == "workFlowBtn") {
                var queryArgs = {
                    entityId: entityId,
                    workItemId: workItemId,
                    result: result,
                    isSubmit: true,
                    enableAllFields: true,
                    addConfirmButton: true,
                }
                addDataFactory.openWorkItemHandlePage(pageCode, queryArgs).then(function (dataJson) {
                    if (!dataJson.success) {
                        myAlertFactory.showAlert(dataJson);
                        $scope.confirmDisable = true;
                    } else {
                        $scope.workflowInfo.section = dataJson.data.workflow.section;
                        if (dataJson.data.editJson) {
                            $scope.addFormInfo = dataJson.data.editJson;
                            $scope.saveParams.$isSize = true;
                            mDefault = $scope.addFormInfo.data;
                            mRecord = $scope.addFormInfo.title;
                            $scope.makeForm(mDefault, mRecord);
                        }
                    }
                })
            } else if (typeName == "edit") {
                var args = {
                    isConvert: true,
                    srcUnitId: $stateParams.unitId,
                    srcEntityId: entityId
                }
                addDataFactory.editData(formType, args).then(function (dataInfo) {
                    entityId = dataInfo.entityId ? dataInfo.entityId : "";
                    $scope.addFormInfo = dataInfo.data.editJson;
                    mDefault = dataInfo.data.editJson.data;
                    mRecord = dataInfo.data.editJson.title;
                    mButton = dataInfo.data.toolBarJson.other;
                    urlArgs = dataInfo.data.urlArgs ? dataInfo.data.urlArgs : "";
                    mUnitCode = dataInfo.data.unitCode;
                    mUrlArgs = urlArgs;
                    $scope.makeForm(mDefault, mRecord);
                    $scope.makeButton(mButton, urlArgs);
                });
            } else {
                //基本信息表单页面
                addDataFactory.getFormInfo(formType, entityId, editId).then(function (dataJson) {
                    unitId = dataJson.data.unitId
                    if (!dataJson.success) {
                        myAlertFactory.showAlert(dataJson);
                    } else {
                        $scope.addFormInfo = dataJson.data.formJson;
                        mDefault = $scope.addFormInfo.data;
                        mRecord = $scope.addFormInfo.title;
                        mButton = dataJson.data.toolBarJson.other;
                        if (dataJson.data.workflow) {
                            workflowBtn = dataJson.data.workflow.buttons;
                            workflowBtn['workItemId'] = dataJson.data.workflow.workItemId;
                        }
                        urlArgs = dataJson.data.urlArgs ? dataJson.data.urlArgs : "";
                        mUnitCode = dataJson.data.unitCode;
                        mUrlArgs = urlArgs;
                        $scope.makeForm(mDefault, mRecord)
                        try {
                            $scope.makeButton(mButton, urlArgs, workflowBtn);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                })
            }
        }
        //展示其他按钮
        $scope.show = function () {
            $scope.otherSheet = $ionicActionSheet.show({
                buttons: buttonsOptions,
                titleText: '其他操作',
                cancelText: '取消',
                cssClass: 'social-actionsheet',
                buttonClicked: function (index, item) {
                    var args;
                    switch (item.onclick) {
                        case 'CommonBusiness.doFireServerEventButtonClick':
                            args = {
                                entityIds: [$stateParams.entityId],
                                method: item.name
                            };
                            addDataFactory.doFireServerEventButtonClick($stateParams.formType, args).then(function (data) {
                                $state.reload();
                                myAlertFactory.showAlert(data, "提交成功");
                            })
                            break;
                        case 'EntityEdit.doConfirm':
                            if (mUrlArgs.isSubmit) {
                                args = {
                                    method: mUrlArgs.method,
                                    workItemId: mUrlArgs.workItemId,
                                    result: mUrlArgs.result,
                                    form: $scope.saveParams,
                                    enableAllFields: true
                                }
                            } else {
                                $scope.updateSaveParams();
                                args = {
                                    method: mUrlArgs.method,
                                    entityIds: [entityId],
                                    data: [$scope.saveParams]
                                }
                                console.log($scope.saveParams);
                                addDataFactory.doConfirm(mUnitCode, args).then(function (dataInfo) {
                                    myAlertFactory.showAlert(dataInfo, "操作成功",true,true)                                    
                                })
                            }
                            break;

                        case 'EntityEdit.doConvert("Crm.Channel")':
                            $state.go('addData', {
                                typeName: 'edit',
                                entityId: entityId,
                                formType: 'Channel',
                                unitId: unitId
                            });
                            break;
                        case 'EntityEdit.doSave':
                            if ($scope.myForm.$error.required) {
                                myAlertFactory.showItAlert('请把必填的字段填写完整')
                            } else if ($scope.myForm.$error.pattern) {
                                myAlertFactory.showItAlert($scope.myForm.$error.pattern[0].$name + '格式不正确');
                            } else {
                                $scope.saveData();
                            }
                            break;
                        case 'EntityEdit.doSubmit':
                            args = {
                                entityIds: [entityId],
                                forms: [$scope.saveParams]
                            }
                            if ($scope.myForm.$error.required) {
                                myAlertFactory.showItAlert('请把必填的字段填写完整')
                            } else if ($scope.myForm.$error.pattern) {
                                myAlertFactory.showItAlert($scope.myForm.$error.pattern[0].$name + '格式不正确');
                            } else {
                                addDataFactory.doSubmit(formType, args).then(function (dataInfo) {
                                    myAlertFactory.showAlert(dataInfo, "操作成功")
                                    //     if (dataInfo['<isError>']) {
                                    //         myAlertFactory.showAlert(dataInfo, "操作成功")
                                    //     } else {
                                    //         myAlertFactory.showItAlert("操作成功", true)
                                    //     }
                                })
                            }

                            break
                    }
                    if (item.handlePage) {
                        $state.go('otherOperationForm', {
                            typeName: 'otherBtn',
                            method: item.name,
                            pageCode: item.handlePage.code,
                            btnText: item.text,
                            entityId: entityId
                        });
                    }
                    return true;
                }
            })
        }
        //新增页面的保存功能
        $scope.formAddData = function () {
            if ($scope.myForm.$error.required) {
                myAlertFactory.showItAlert('请把必填的字段填写完整')
            } else if ($scope.myForm.$error.pattern) {
                myAlertFactory.showItAlert($scope.myForm.$error.pattern[0].$name + '格式不正确');
            } else {
                $scope.saveData();
            }
        }
        //展示工作流按钮
        $scope.showWorkflow = function () {
            var workItemId = workflowBtnOptions['workItemId'] ? workflowBtnOptions['workItemId'] : "";
            $ionicActionSheet.show({
                buttons: workflowBtnOptions,
                titleText: '工作流',
                cancelText: '取消',
                cssClass: 'social-actionsheet',
                buttonClicked: function (index, item) {
                    var args;
                    switch (item.onclick) {
                        case 'EntityForm.drawWorkItem':
                            args = {
                                workItemId: workItemId
                            };
                            addDataFactory.drawWorkItem(args).then(function (data) {
                                myAlertFactory.showAlert(data, "领取成功");
                                $state.reload();
                            })
                            break;
                    }
                    if (item.page) {
                        $state.go('workflowForm', {
                            typeName: 'workFlowBtn',
                            result: item.id,
                            workItemId: workItemId,
                            entityId: entityId,
                            pageCode: item.page.code
                        });
                    }
                    return true;
                }
            });
        }
        //判断是否只读的表单
        $scope.isReadOnlyForm = function () {
            if (formType == "VIPInfo" || (formType == "Channel" && typeName != "edit") || formType == "Product" || (formType == "SalesSub" && editId != undefined) || location.pathname.indexOf('birthday') > 0 || location.pathname.indexOf('PayMoney') > 0) {
                $scope.isReadOnly = true;
            }
        }
        //事件传递
        $scope.$on('$destroy', function () {
            if ($scope.modal) {
                $scope.modal.remove();
            }
        });
        $scope.$on('$stateChangeStart', function () {
            if ($scope.modal.isShown()) {
                $scope.modal.hide();
            }
        });
        $scope.loadData();
        $scope.isReadOnlyForm();
    }])
    //产品介绍
    .controller('introduceCtrl', ['introduceFactory', '$ionicPopup', '$scope', '$ionicModal', '$window', '$stateParams', function (introduceFactory, $ionicPopup, $scope, $ionicModal, $window, $stateParams) {
        var vm = this;
        var imgPopup;
        // alert(ionic.Platform.isAndroid());
        vm.productInfo = [];
        vm.onTap = function (fid, $event) {
            if (ionic.Platform.isAndroid()) {
                imgPopup = $ionicPopup.show({
                    template: "<img zoom-image class='img-zoom' src='./Ecp.Attachment.downloadEntityAttachment.jdn?args={\"attachmentId\":" + fid + "}'>",
                    cssClass: 'img-popup',
                    scope: $scope,
                    buttons: [{
                        text: '取消'
                    }]
                })
            } else {
                $window.location.href = './Ecp.Attachment.downloadEntityAttachment.jdn?args={"attachmentId":' + fid + '}'
            }
        }
        introduceFactory.getProductInfo($stateParams.entityId).then(function (dataInfo) {
            vm.productInfo = dataInfo.data.records;
        });
    }])