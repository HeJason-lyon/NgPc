angular.module('xiaoniu.services', [])
    //部分无法配置的表单禁止状态
    .constant("IsDisable", ["FPayMoney", "FContractAmo", "FContractNoId", "FDepartmentId", "FProductId"])
    //部分无法配置的表单可编辑状态
    .constant("IsNoDisable", ["FAuditDep"])
    //工作流的模块
    .constant('IsWorkingModule', ["客户档案", "渠道费用", "业绩管理", "特别推动佣金", "产品预约"])
    //http拦截拦截器
    .factory('myInterceptor', ['$q', '$rootScope', '$injector', function ($q, $rootScope, $injector) {
        //获取请求的数量
        var count = 0;
        //是否显示loading true：不显示 false ： 显示 为了与瀑布流和下拉刷新区分
        var api;
        //是否已经显示
        var isAlert = false;
        var timestampMarker = {
            request: function (config) {
                api = config.isLoading;
                //判断loading状态和是否模板加载
                if (!api && (config.url.indexOf('templates') < 0)) {
                    count++;
                    //传递事件，app-run.js处理
                    $rootScope.$broadcast('loading:show')
                }
                return config;
            },
            requestError: function (rejection) {
                $rootScope.$broadcast('loading:hide');
                return $q.reject(rejection);
            },
            response: function (response) {
                var myAlertFactory = $injector.get('myAlertFactory');
                count--;
                //请求结束，传递事件
                if (count <= 0) {
                    $rootScope.$broadcast('loading:hide');
                }
                try {
                    //如果ecode是401，则是被踢出登录
                    if (response.data.data.ecode == "401" && !isAlert) {
                        isAlert = true;
                        myAlertFactory.showLoginAlert(response.data.data.msg);
                    }
                } catch (e) {
                    
                }

                return response;
            },
            responseError: function (rejection) {
                $rootScope.$broadcast('loading:hide');
                return $q.reject(rejection);
            }

        };
        return timestampMarker;
    }])
    //index页面的服务
    .factory('indexFactory', ['$http', '$q', function ($http, $q) {
        var mSevices = [];
        var deferred;
        var promise;
        return {
            getMenuData: function (args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Ecp.MobileHomepageItem.prepareHomepage', {
                    params: {
                        args: args
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                });
                return promise;
            },
            saveMenuData: function (args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Ecp.MobileHomepageItem.updateWxItem', {
                    params: {
                        args: args
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                });
                return promise;
            },
            getUserInfo: function () {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('api/Ecp.OnlineUser.getLoginUser').success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            }
        }
    }])
    //用户信息的服务
    .factory('aboutMeFactory', ['$http', '$q', function ($http, $q) {
        var deferred;
        var promise;
        return {
            getUserInfo: function (args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Ecp.User.MobileForm.mdp', {
                    params: {
                        args: args
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            },
            logOut: function () {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('api/Ecp.OnlineUser.logout').success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            }
        }
    }])
    //客户跟进的服务
    .factory('followUpFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            getData: function (args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Crm.Activity.getHomepageCalendarListDataJson', {
                    params: {
                        args: args
                    }
                }).success(function (data) {
                    deferred.resolve(data.data);
                })
                return promise;
            },
            deleteItem: function (args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Crm.Activity.delete', {
                    params: {
                        args: {
                            "entityIds": [args]
                        },
                        "pageCode": "Ecp.Homepage"
                    }

                }).success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            }
        }
    }])
    //本周付息客户
    .factory('payMoneyFactory', ['$q', '$http', function ($q, $http) {
        return {
            getData: function (pageIndex, isLoading) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                //不存在页面
                $http.post('Crm.SalesSub.getListData.jdt', {
                    args: {
                        "listId": "fd866a13-2c06-4008-aaf1-cd4778068127",
                        'pageIndex': pageIndex,
                        "schemaId": "30af4ab0-aca6-40b7-a4b2-6a63142d4f71",
                        'pageSize': 10
                    },
                    "pageCode": "Ecp.Homepage"
                }, {
                        "isLoading": isLoading
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                return promise;
            }
        };
    }])
    //查询目标服务
    .factory('queryFactory', ['$http', '$q', function ($http, $q) {
        var deferred;
        var promise;
        return {
            getDepartmentInfo: function () {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('api/Crm.HomeCount.getDepartment').success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            },
            getInitDepartment: function () {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('api/Crm.HomeCount.getPageData').success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            },
            getSearchData: function (argsData) {
                deferred = $q.defer();
                promise = deferred.promise;
                //失败
                $http.post('Crm.HomeCount.doQueryHomeCount.jdt', {
                    args: argsData
                }).success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            }
        };
    }])
    //今日生日客户的服务
    .factory('birthdayFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            getBirthdayInfo: function (pageIndex, isLoading) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('Crm.Customer.getListData.jdt', {
                    "args": {
                        "listId": "2fc75413-445c-42a5-bd91-c212d7d053ff",
                        'pageIndex': pageIndex,
                        "schemaId": "0728b7fe-5000-4f26-a740-845ba5d9913d",
                        "pageSize": 10
                    },
                    "pageCode": "Ecp.Homepage"
                }, {
                        "isLoading": isLoading
                    })
                    .success(function (dataJson) {
                        deferred.resolve(dataJson);
                    });
                return promise;
            }
        };
    }])
    //更改密码的服务
    .factory('changePasswordFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            changePassword: function (args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Ecp.OnlineUser.modifyPassword', {
                    params: {
                        args: args
                    }
                })
                    .success(function (dataJson) {
                        deferred.resolve(dataJson);
                    });
                return promise;
            },
            getValidate: function () {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Ecp.User.validateCodeWx')
                    .success(function (dataJson) {
                        deferred.resolve(dataJson);
                    });
                return promise;
            }
        }
    }])
    //客户业绩的服务
    .factory('customerAchievementFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            getData: function (customerId) {
                deferred = $q.defer();
                promise = deferred.promise;
                //不存在
                $http.post('Crm.SalesSub.getListData.jdt', {
                    "args": {
                        "pageIndex": 1,
                        "refresh": true,
                        "unitId": "a68dfb91-a9cf-44d9-a086-af316e9c4f0e",
                        "listId": "9ea4fde2-325d-4383-9815-d400d1257ad2",
                        "relationId": "8317d8f2-bf5a-4e6e-a2be-f198a462e874",
                        "masterEntityId": customerId
                    },
                    "pageCode": "Crm.Customer.SalesSubList"
                })
                    .success(function (dataJson) {
                        deferred.resolve(dataJson);
                    });
                return promise;
            }
        }
    }])
    //客户app业绩
    .factory('customerAppAchievementFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            getData: function (customerId) {
                deferred = $q.defer();
                promise = deferred.promise;
                //不存在
                $http.post('Crm.AppReCord.getListData.jdt', {
                    "args": {
                        "pageIndex": 1,
                        "refresh": true,
                        "unitId": "e6f7ecc2-5560-492b-a356-af01efbd99a7",
                        "listId": "a9518a88-3f44-4aa4-b901-ff01981bc237",
                        "relationId": "bc099079-f264-4523-a1a2-799406ca72a5",
                        "masterEntityId": customerId
                    },
                    "pageCode": "Crm.Customer.AppReCordList"
                })
                    .success(function (dataJson) {
                        deferred.resolve(dataJson);
                    });
                return promise;
            },
            getAppData: function (customerId) {
                deferred = $q.defer();
                promise = deferred.promise;
                //不存在
                $http.post('Crm.AppComm.getListData.jdt', {
                    "args": {
                        "pageIndex": 1,
                        "refresh": true,
                        "unitId": "df5273d7-c4a8-4867-bf83-9cae2e364af0",
                        "listId": "3fbdc76f-eb63-4786-b5f5-e68665234f66",
                        "relationId": "6f0ff997-f92c-41f3-9618-0539cf584af5",
                        "masterEntityId": customerId
                    },
                    "pageCode": "Crm.Customer.AppCommList"
                })
                    .success(function (dataJson) {
                        deferred.resolve(dataJson);
                    });
                return promise;
            }
        }
    }])
    //会员积分服务
    .factory('memberIntegralFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            getData: function (memberId) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('api/Crm.VIPInfo.IntegralDetailList.mdp', {
                    args: {
                        "masterUnitId": "2e74779e-cfd4-4815-881c-5983e6a6035e",
                        "addToLastOpen": false
                    }
                }).success(function (data) {
                    $http.get('api/Crm.IntegralDetail.getWeixinQYListData', {
                        params: {
                            args: {
                                "listId": data.data.arguments.listId,
                                "masterEntityId": memberId,
                                "relationId": "5e0af20b-3b0e-4a47-92c1-c95513b36c50"
                            },
                            "pageCode": "Crm.VIPInfo.IntegralDetailList"
                        }
                    })
                        .success(function (dataJson) {
                            deferred.resolve(dataJson.data);
                        });
                })
                return promise;
            }
        }
    }])
    //业绩积分
    .factory('achieveIntegralFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            getListData: function (achieveId) {
                deferred = $q.defer();
                promise = deferred.promise;
                // console.log(achieveId);
                $http.post('api/Crm.SalesSub.IntegralDetailList.mdp', {
                    args: {
                        "masterUnitId": "a68dfb91-a9cf-44d9-a086-af316e9c4f0e",
                        "masterEntityId": achieveId,
                        "addToLastOpen": false
                    }
                }).success(function (data) {
                    $http.get('api/Crm.IntegralDetail.getWeixinQYListData', {
                        params: {
                            args: {
                                'listId': data.data.arguments.listId,
                                "masterEntityId": achieveId,
                                "relationId": "ebfb7ab2-6bd1-4f8d-bb15-b6e2731eba9b"
                            }
                        }
                    })
                        .success(function (dataJson) {
                            deferred.resolve(dataJson.data);
                        })
                })
                return promise;
            }
        }
    }])
    //业绩提成
    .factory('achieveMoneyFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            getListData: function (achieveId) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('api/Crm.SalesSub.SalaTageList.mdp', {
                    args: {
                        "masterUnitId": "a68dfb91-a9cf-44d9-a086-af316e9c4f0e",
                        "masterEntityId": achieveId,
                        "addToLastOpen": false
                    }
                }).success(function (data) {
                    $http.get('api/Crm.SalaTage.getWeixinQYListData', {
                        params: {
                            args: {
                                listId: data.data.listId,
                                "masterEntityId": achieveId,
                                "relationId": "ebfb7ab2-6bd1-4f8d-bb15-b6e2731eba9b"
                            }
                        }
                    })
                        .success(function (dataJson) {
                            deferred.resolve(dataJson.data);
                        })
                })
                return promise;
            }
        }
    }])
    //知识库服务
    .factory('knowledgeFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            getListData: function (searchWord, knowledegeId) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('api/Oa.Knowledge.MobileList.mdp', {
                    args: {
                        "masterUnitId": "a68dfb91-a9cf-44d9-a086-af316e9c4f0e",
                        "addToLastOpen": false
                    }
                }).success(function (data) {
                    $http.get('api/Oa.Knowledge.getWeixinQYListData', {
                        params: {
                            args: {
                                listId: data.data.listId,
                                "relationId": "766583e9-ce6e-4bd4-bc7f-6b5abb3fdb67",
                                "masterEntityId": knowledegeId,
                                'keyword': searchWord,
                                "includeSelf": true,
                                "includeIndirectSub": true
                            }
                        }
                    })
                        .success(function (dataJson) {
                            deferred.resolve(dataJson.data);
                        })
                })
                return promise;
            },
            getTreeData: function () {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Oa.KnowledgeCatalog.getTreeData').success(function (dataJson) {
                    deferred.resolve(dataJson.data);
                })
                return promise;
            }
        }
    }])
    //待办工作项的服务
    .factory('workingFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            getListData: function (pageIndex, isLoading) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('api/Wf.WorkItem.MobileTodoList.mdp', null, {
                    "isLoading": isLoading
                }).success(function (data) {
                    $http.get('api/Wf.WorkItem.getTodoMobileListData', {
                        params: {
                            args: {
                                listId: data.data.listId,
                                "pageIndex": pageIndex,
                                "schemaId": "d6a812ef-c2f5-4bc3-8571-eb2e77f1906f",
                                "pagesize": 10
                            }
                        },
                        "isLoading": isLoading
                    })
                        .success(function (dataJson) {
                            deferred.resolve(dataJson);
                        })
                })
                return promise;
            },
            getPageCode: function (workItemId) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Wf.WorkItem.getHandleInformation', {
                    params: {
                        "args": {
                            "workItemId": workItemId
                        }
                    }
                }).success(function (data) {
                    deferred.resolve(data.data);
                });
                return promise;
            }
        }
    }])
    //树状列表的公共方法
    .factory('treeDataFactory', ['$q', '$http', 'knowledgeFactory', function ($q, $http, knowledgeFactory) {
        var deferred;
        var promise;
        getLevelInfoText = function (filterLevelInfo) {
            var levelInfoLength = filterLevelInfo.length - 1;
            return filterLevelInfo[levelInfoLength].text;
        }
        getLevelInfoId = function (filterLevelInfo) {
            var levelInfoLength = filterLevelInfo.length - 1;
            return filterLevelInfo[levelInfoLength].id;
        }
        return {
            getLevelInfoText: getLevelInfoText,
            getLevelInfoId: getLevelInfoId,
            saveLevelInfo: function (filterLevelInfo, searchWord) {
                deferred = $q.defer();
                promise = deferred.promise;
                var knowledgeId = getLevelInfoId(filterLevelInfo);
                knowledgeFactory.getListData(searchWord, knowledgeId).then(function (dataJson) {
                    deferred.resolve(dataJson);
                });
                return promise;
            },
            getChildren: function (item) {
                return item.children;
            }
        };
    }])
    //业绩和客户列表的服务
    .factory('listDataFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            getListData: function (url, searchWord, pageIndex, isLoading, orderName, schemaId) {
                deferred = $q.defer();
                promise = deferred.promise;
                if (url != "Customer") {
                    $http.post('api/Crm.' + url + '.MobileList.mdp').success(function (data) {
                        $http.get('api/Crm.' + url + '.getWeixinQYListData', {
                            params: {
                                args: {
                                    "listId": data.data.listId,
                                    'pageIndex': pageIndex,
                                    "schemaId": schemaId,
                                    "keyword": searchWord
                                }
                            },
                            "isLoading": isLoading
                        })
                            .success(function (dataJson) {
                                deferred.resolve(dataJson.data);
                            })
                    })
                } else {
                    var reverse = orderName.reverse ? 'desc' : 'asc';
                    var predicate = orderName.predicate ? orderName.predicate : 'FTotalAmo';
                    $http.post('api/Crm.' + url + '.MobileList.mdp').success(function (data) {
                        $http.get('api/Crm.' + url + '.getWeixinQYListData', {
                            params: {
                                args: {
                                    "listId": data.data.listId,
                                    "schemaId": schemaId,
                                    'pageIndex': pageIndex,
                                    "keyword": searchWord,
                                    "order": [predicate + " " + reverse]
                                }
                            },
                            "isLoading": isLoading
                        })
                            .success(function (dataJson) {
                                deferred.resolve(dataJson.data);
                            })
                    })
                }
                return promise;
            },
            getOrderData: function (url, searchWord, orderName, isLoading, schemaId) {
                deferred = $q.defer();
                promise = deferred.promise;
                var reverse = orderName.reverse ? 'desc' : 'asc';
                var predicate = orderName.predicate ? orderName.predicate : 'FTotalAmo';
                $http.post('api/Crm.' + url + '.MobileList.mdp').success(function (data) {
                    $http.get('api/Crm.' + url + '.getWeixinQYListData', {
                        params: {
                            args: {
                                "listId": data.data.listId,
                                "schemaId": schemaId,
                                "keyword": searchWord,
                                "order": [predicate + " " + reverse]
                            }
                        },
                        "isLoading": isLoading
                    })
                        .success(function (dataJson) {
                            deferred.resolve(dataJson.data);
                        })
                })
                return promise;
            }
        }
    }])
    //产品介绍接口
    .factory('introduceFactory', ['$q', '$http', function ($q, $http) {
        var deferred;
        var promise;
        return {
            getProductInfo: function (id) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('Ecp.Attachment.getListData.jdt', {
                    "args": {
                        "listId": "78a566fb-50a2-4d14-9e59-35227457fa01",
                        "masterEntityId": id
                    },
                    "pageCode": "Crm.Product.Attachment"
                })
                    .success(function (dataJson) {
                        deferred.resolve(dataJson);
                    })
                return promise;
            }
        };
    }])
    .factory('myAlertFactory', ['$ionicPopup', '$ionicHistory', '$window', function ($ionicPopup, $ionicHistory, $window) {
        function showAlert(content, isBack,callBack) {
            var alertPopupOptions = {
                title: '提示',
                template: content,
                okText: '确定',
                okType: 'button-orange',
                buttons: [{
                    text: 'OK',
                    type: 'button-orange',
                    onTap: function (e) {
                        if (callBack) {
                            callBack()
                        }
                    }
                }]
            }
            var myAlert = $ionicPopup.show(alertPopupOptions);
            myAlert.then(function (res) {
                if ($ionicHistory.backView() && isBack) {                    
                    $ionicHistory.goBack();
                }
            });
        }
        return {
            showAlert: function (data, successMessage, isBack, otherMessage) {
                var ecode
                try {
                    ecode = data.data.ecode;
                } catch (e) {
                    console.log(e);
                } if (data.msg) {
                    showAlert(data.msg, isBack);
                } else if ((data['<isError>'] || data.success === false) && data.page) {
                    var alertStr = data.message.replace('以下', '')
                    alertStr += "(" + data.page.data.listData[0].condition + ")";
                    showAlert(alertStr, isBack);
                } else if (data['<isError>'] || data.success === false) {
                    var msg = data.data.message ? data.message : data.data.msg;
                    showAlert(msg, isBack)
                } else if (ecode == "401") {
                    return;
                } else {
                    showAlert(successMessage, isBack);
                }
            },
            showItAlert: function (message, isBack) {
                showAlert(message, isBack);
            },
            showLoginAlert: function (message) {
                showAlert(message, false, function () {
                    $window.location.reload();
                });
            }
        };
    }])
    //动态表单数据生成服务
    .factory('addDataFactory', ['$q', '$http', '$ionicPopup', '$state', function ($q, $http, $ionicPopup, $state) {
        var deferred;
        var promise;
        return {
            getFormInfo: function (url, args, editId) {
                deferred = $q.defer();
                promise = deferred.promise;
                if (url == "WorkItem") {
                    $http.get('Wf.WorkItem.getHandleInformation.jdt', {
                        params: {
                            args: {
                                workItemId: args
                            }
                        }
                    }).success(function (data) {
                        $http.get('api/' + data.mobileUrl, {
                            params: data.args
                        }).success(function (data2) {
                            deferred.resolve(data2);
                        })
                    });
                } else if (url == "knowledege") {
                    $http.get('api/Oa.Knowledge.MobileForm.mdp', {
                        params: {
                            args: {
                                entityId: args
                            }
                        }
                    }).success(function (data) {
                        deferred.resolve(data);
                    })
                } else {
                    $http.get('api/Crm.' + url + '.MobileForm.mdp', {
                        params: {
                            args: {
                                entityId: args,
                                editId: editId
                            }
                        }
                    }).success(function (data) {
                        deferred.resolve(data);
                    })
                }
                return promise;
            },
            getSelectedInfo: function (urlPre, options, isLoading) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.post('api/' + urlPre + '.SelectList.mdp').success(function (data) {
                    options.listId = data.data.listId;
                    $http.get('api/' + urlPre + '.getWeixinQYListData', {
                        params: {
                            args: options
                        },
                        "isLoading": isLoading
                    }).success(function (data2) {
                        deferred.resolve(data2.data);
                    });
                })
                return promise;
            },
            getDictionaryInfo: function (directoryId, parentText) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Ecp.Dictionary.prepareMobileSelect', {
                    params: {
                        args: {
                            'dictionaryId': directoryId,
                            "parentValue": parentText
                        }
                    }
                }).success(function (data) {
                    deferred.resolve(data.data);
                })
                return promise;
            },
            saveData: function (urlPre, args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Crm.' + urlPre + '.save', {
                    params: {
                        args: {
                            data: [args]
                        }
                    }
                }).success(function (data) {
                    deferred.resolve(data.data);
                })
                return promise;
            },
            doFireServerEventButtonClick: function (urlPre, args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Crm.' + urlPre + '.confirm', {
                    params: {
                        args: args
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            },
            doOpenFormButtonClick: function (urlPre, args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/' + urlPre + '.mdp', {
                    params: {
                        args: args
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            },
            //不确定
            doConfirm: function (urlPre, args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/' + urlPre + '.confirm', {
                    params: {
                        args: args
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            },
            drawWorkItem: function (args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Wf.WorkItem.draw', {
                    params: {
                        args: args
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            },
            finishWorkItem: function (args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Wf.WorkItem.finish', {
                    params: {
                        args: args
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            },
            openWorkItemHandlePage: function (urlPre, args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/' + urlPre + '.mdp', {
                    params: {
                        args: args
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            },
            editData: function (urlPre, args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Crm.' + urlPre + '.Edit.mdp', {
                    params: {
                        args: args
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            },
            getMultiEntityBox: function (fieldId, entityType, valueArrayId) {
                deferred = $q.defer();
                promise = deferred.promise;
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Ecp.Entity.MultiEntityBoxItems.mdp', {
                    params: {
                        "args": {
                            "fieldId": fieldId,
                            "unitCode": entityType,
                            "entityIds": valueArrayId
                        }
                    }
                }).success(function (data) {
                    $http.get('api/Ecp.Misc.getMultiEntityBoxItemListData', {
                        params: {
                            "args": {
                                "unitId": data.data.unitId,
                                "entityIds": valueArrayId
                            }
                        }
                    }).success(function (data) {
                        deferred.resolve(data.data);
                    })
                })
                return promise;
            },
            getLinkageData: function (fieldId, formArgs) {
                deferred = $q.defer();
                promise = deferred.promise;
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get('api/Ecp.FieldLinkage.getLinkageData', {
                    params: {
                        "args": {
                            "fieldId": fieldId,
                            "form": formArgs
                        }
                    }
                }).success(function (data) {
                    deferred.resolve(data.data);
                })
                return promise;
            },
            doSubmit: function (urlPre, args) {
                deferred = $q.defer();
                promise = deferred.promise;
                $http.get("Crm." + urlPre + '.submit.jdt', {
                    params: {
                        "args": args
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                })
                return promise;
            }

        };
    }])