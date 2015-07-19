'use strict';

/**
 * @ngdoc function
 * @name networkAnalyzerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the networkAnalyzerApp
 */
angular.module('networkAnalyzerApp')
  .controller('MainCtrl', function ($scope, UserService, $timeout, $window, $modal) {
        $scope.user = UserService.user;
      $scope.data = {
        selectedIndex : 0
      };
      $scope.next = function() {
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
      };
      $scope.previous = function() {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
      };

        $scope.toggleNames = function() {
            $scope.user.highlighted = angular.copy($scope.user.highlighted);
            $scope.user.highlighted.action = 1;
            $scope.user.highlighted.status = !$scope.user.highlighted.status;
        };


        $scope.changeHighlight = function() {
            var h = $scope.user.highlight.prop;
            angular.forEach($scope.user.profiles, function(p) {
                if (p[h] === '1') {
                    p.highlight = true;
                } else {
                    p.highlight = false;
                }
            });
            $scope.user.highlighted = angular.copy($scope.user.highlighted);
            $scope.user.highlighted.action = 2;
            $scope.user.highlighted.status = !$scope.user.highlighted.status;
        };


        var new_profile = {profile_id:null, full_name:'', industry:'', same_industry:'0', school:'', same_school:'0'};
        new_profile.same_gender = '0';
        new_profile.same_nationality = '0';
        new_profile.same_ethnicity = '0';
        new_profile.is_faculty = '0';
        new_profile.level = '0';
        new_profile.tech_skill = '0';
        new_profile.finance_skill = '0';
        new_profile.ops_skill = '0';
        new_profile.sales_skill = '0';
        new_profile.prod_skill = '0';
        new_profile.gm_skill = '0';
        new_profile.vc_skill = '0';
        new_profile.other_skill = '0';
        new_profile.same_skill = '0';

      $scope.userGridOptions = {
          enableFiltering: true,
          showGridFooter: true,
          enableSorting: true,
          multiSelect: false,
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          columnDefs: [
              { field: 'full_name', displayName:"Name", type:'string'},
              { field: 'industry', displayName:"Industry", type:'string'},
              { field: 'school', displayName:"School", type:'string'}
          ]
      };

        $scope.initGrid = function() {
            $scope.userGridOptions.data = UserService.user.profiles;
            $scope.profile = angular.copy(new_profile);
        };

        $scope.userGridOptions.onRegisterApi = function(gridApi){
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                if (row.isSelected) {
                    if (row.entity.profile_id !== 0) {
                        $scope.profile = row.entity;
                    } else {
                        row.isSelected = false;
                    }

                } else {
                    $scope.profile = angular.copy(new_profile);
                }
            });
        };


        $scope.addProfile = function() {
            if ($scope.profile.full_name === '') {
                alert("Please enter the member name.");
                return;
            }
            var db_call = UserService.addProfile($scope.profile);
            db_call.success(function(data) {
                if (!data) {
                    alert("Error adding member.");
                } else {
                    $scope.profile.profile_id = data;
                    UserService.user.profiles.push(angular.copy($scope.profile));
                    $scope.profile = angular.copy(new_profile);
                    $scope.gridApi.selection.clearSelectedRows();
                }
            }).
                error(function(data, status) {
                    alert("Error: " + status + " Add member failed. Check your internet connection");
                });
        };

        $scope.updateProfile = function() {
            var db_call = UserService.updateProfile($scope.profile);
            db_call.success(function(data) {
                if (!data) {
                    alert("Error updating member.");
                } else {
                    $scope.profile = angular.copy(new_profile);
                    $scope.gridApi.selection.clearSelectedRows();
                }
            }).
                error(function(data, status) {
                    alert("Error: " + status + " Update member failed. Check your internet connection");
                });
        };

        $scope.deleteProfile = function() {
            var db_call = UserService.deleteProfile($scope.profile);
            db_call.success(function(data) {
                if (!data) {
                    alert("Error deleting member.");
                } else {
                    var i = _.indexOf(UserService.user.profiles, $scope.profile);
                    UserService.user.profiles.splice(i,1);
                }
            }).
                error(function(data, status) {
                    alert("Error: " + status + " Delete member failed. Check your internet connection");
                });
        };

        $scope.connectionsGridOptions = {
            enableFiltering: true,
            enableSorting: true,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            showGridFooter:true,
            columnDefs: [
                { field: 'full_name', name:"Name", type:'string'}
            ]
        };

        $scope.initConnectionsGrid = function() {
            $scope.connectionsGridOptions.data = UserService.user.profiles;
        };

        $scope.connections = [];

        $scope.connectionsGridOptions.onRegisterApi = function(gridApi){
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                if (row.isSelected) {
                    if (row.entity.profile_id === 0) {
                        row.isSelected = false;
                        return;
                    }
                    $scope.connections = [];
                    $scope.selectedProfile = row.entity;
                    $scope.selectedProflileId = row.entity.profile_id;
                    angular.forEach($scope.user.profiles, function(p) {
                        if (p.profile_id === 0) {

                        } else if (p.profile_id !== $scope.selectedProflileId) {
                            var conn = _.find($scope.user.connections, function(c) {
                               return ((c.profile_id1 === $scope.selectedProflileId && c.profile_id2 === p.profile_id) || (c.profile_id1 === p.profile_id && c.profile_id2 === $scope.selectedProflileId));
                            });
                            var has_connection = conn !== undefined;
                            var c = {profile_id: p.profile_id, full_name: p.full_name, is_connection:has_connection, is_disabled:false};
                            $scope.connections.push(c);
                        } else {
                            var c = {profile_id: p.profile_id, full_name: p.full_name, is_connection:true, is_disabled:true};
                            $scope.connections.push(c);
                        }
                    })
                }
            });
        };

        $scope.toggleConnection = function(p) {
            if (p.is_connection) {
                var params = {};
                params.profile_id1 = $scope.selectedProflileId;
                params.profile_id2 = p.profile_id;
                params.net_id = UserService.user.net_id;
                var db_call = UserService.addConnection(params);
                db_call.success(function(data) {
                    if (!data) {
                        alert("Error adding connection.");
                    } else {
                        $scope.user.connections.push(params);
                    }
                }).
                    error(function(data, status) {
                        alert("Error: " + status + " Add connection failed. Check your internet connection");
                    });
            } else {
                var conn = _.find($scope.user.connections, function(c) {
                    return ((c.profile_id1 === $scope.selectedProflileId && c.profile_id2 === p.profile_id) || (c.profile_id1 === p.profile_id && c.profile_id2 === $scope.selectedProflileId));
                });
                UserService.deleteConnection(conn);
            }
        };

        $scope.confirmDelete = function (grid, row) {
            var modalInstance = $modal.open({
                templateUrl: 'confirmModal.html',
                controller: 'ConfirmModalCtrl',
                backdrop: false,
                resolve: {
                    name: function () {
                        return row.entity.user_name;
                    }
                }
            });

            modalInstance.result.then(function () {
                UserService.deleteNetwork(row.entity, UserService.admin.summaries);
            });
        };

        var data = [];
        $scope.adminGridOptions = {
            enableFiltering: true,
            enableSorting: true,
            showGridFooter:true,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            rowHeight:40,
            columnDefs: [
                {width:80, enableFiltering: false, enableSorting: false, name:"Del", cellTemplate:'<div class="ui-grid-cell-contents"><a class="btn btn-default btn-sm" ng-click="grid.appScope.confirmDelete(grid, row)"><i class="fa fa-trash-o"></i></a></div>'},
                { field: 'user_name', displayName:"Name", type:'string'},
                { field: 'network_size', displayName:"Size", width:90, type:'number'}
            ],
            data: data
        };

        $scope.adminGridOptions.onRegisterApi = function(gridApi){
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                if (row.isSelected) {
                    if (row.entity.profile_id === 0) {
                        row.isSelected = false;
                        return;
                    }
                    var net_id = row.entity.net_id;
                    UserService.getNetwork(net_id, row.entity.user_name);
                }
            });
        };

        UserService.login($scope.adminGridOptions);

        $scope.fullscreen = function() {
            $window.open("https://www.kblocks.com/app/network_analyzer/index_lti.php");
        };

        $scope.initNetwork = function() {
            UserService.makeNetwork();
        }


  });

angular.module('networkAnalyzerApp').
    controller('ConfirmModalCtrl', function ($scope, $modalInstance, name) {

        $scope.itm = {name:name};

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
