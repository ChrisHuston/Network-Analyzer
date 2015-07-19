'use strict';

/**
 * @ngdoc service
 * @name networkAnalyzerApp.User
 * @description
 * # User
 * Factory in the networkAnalyzerApp.
 */
angular.module('networkAnalyzerApp')
  .factory('UserService', function ($http, $location) {
      var inst = {};

      inst.appDir = '/app/network_analyzer/';

      inst.user = {loginError:null, priv_level:1, user_name:'', net_id:'', show_names:false,
          profiles:[], connections:[], highlighted:{status:false, action:1}, links:[], stats:[]};
      inst.admin = {summaries:[]};

        inst.makeNetwork = function() {
            inst.user.links = [];
            for (var i = 1; i < inst.user.profiles.length; i++) {
                var ml = {source:0, target:i};
                inst.user.links.push(ml);
            }
            angular.forEach(inst.user.connections, function(c) {
                var source = _.findIndex(inst.user.profiles, {'profile_id': c.profile_id1});
                var target = _.findIndex(inst.user.profiles, {'profile_id': c.profile_id2});
                var l = {source:source, target:target};
                inst.user.links.push(l);
            });
            inst.user.highlighted = angular.copy(inst.user.highlighted);
            inst.user.highlighted.action = 1;
            inst.user.highlighted.status = !inst.user.highlighted.status;
        };

        inst.user.highlights = [
            {label:'Clear', prop:'clear'},
            {label:'Same School', prop:'same_school'},
            {label:'Same Industry', prop:'same_industry'},
            {label:'Faculty', prop:'is_faculty'},
            {label:'More Senior', prop:'more_senior'},
            {label:'Same Level', prop:'same_level'},
            {label:'More Junior', prop:'more_junior'},
            {label:'Same Gender', prop:'same_gender'},
            {label:'Same Nationality', prop:'same_nationality'},
            {label:'Same Ethnic Group', prop:'same_ethnicity'},
            {label:'Tech Skill', prop:'tech_skill'},
            {label:'Finance Skill', prop:'finance_skill'},
            {label:'Ops Skill', prop:'ops_skill'},
            {label:'Sales Skill', prop:'sales_skill'},
            {label:'Prod Skill', prop:'prod_skill'},
            {label:'GM Skill', prop:'gm_skill'},
            {label:'VC Skill', prop:'vc_skill'},
            {label:'Other Skill', prop:'other_skill'},
            {label:'Same Skill', prop:'same_skill'}
        ];

        var max_connections = function(size) {
            var max = 0;
            for (var i=size-1; i > 0; i--) {
                max += i;
            }
            return max;
        };

        var initStats = function(summaries) {
            inst.user.stats = [];
            var obj;
            obj = {label:'Network Size', me:0, avg:0, prop:'network_size'};
            inst.user.stats.push(obj);
            obj = {label:'Network Density', me:0, avg:0, prop:'density'};
            inst.user.stats.push(obj);
            obj = {label:'Same Industry', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_industry'};
            inst.user.stats.push(obj);
            obj = {label:'Same Business School', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_school'};
            inst.user.stats.push(obj);
            obj = {label:'Faculty', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_faculty'};
            inst.user.stats.push(obj);
            obj = {label:'More Senior', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_senior'};
            inst.user.stats.push(obj);
            obj = {label:'Same Level', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_level'};
            inst.user.stats.push(obj);
            obj = {label:'More Junior', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_junior'};
            inst.user.stats.push(obj);
            obj = {label:'Same Gender', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_gender'};
            inst.user.stats.push(obj);
            obj = {label:'Same Nationality', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_nationality'};
            inst.user.stats.push(obj);
            obj = {label:'Same Ethnic Group', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_ethnicity'};
            inst.user.stats.push(obj);
            obj = {label:'Technical Skills', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_tech'};
            inst.user.stats.push(obj);
            obj = {label:'Finance Skills', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_finance'};
            inst.user.stats.push(obj);
            obj = {label:'Operations Skills', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_ops'};
            inst.user.stats.push(obj);
            obj = {label:'Sales Skills', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_sales'};
            inst.user.stats.push(obj);
            obj = {label:'Prod. Development Skills', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_prod'};
            inst.user.stats.push(obj);
            obj = {label:'Gen. Management Skills', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_gm'};
            inst.user.stats.push(obj);
            obj = {label:'VC Skills', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_vc'};
            inst.user.stats.push(obj);
            obj = {label:'Other Skills', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_other'};
            inst.user.stats.push(obj);
            obj = {label:'Same Skills', me:0, avg:0, me_p:0, avg_p:0, prop:'agg_skill'};
            inst.user.stats.push(obj);
            var total_profiles = 0;
            angular.forEach(summaries, function(s) {
                var is_user = s.net_id === inst.user.net_id;
                s.network_size = parseInt(s.network_size);
                total_profiles += s.network_size;
                angular.forEach(inst.user.stats, function(d) {
                    if (d.prop === 'density') {
                        var max = max_connections(s.network_size);
                        s.density = s.num_connections/max;
                        if (is_user) {
                            d.me = s.density;
                        }
                        d.avg += s.density;
                    } else {
                        if (is_user) {
                            d.me = parseInt(s[d.prop]);
                            if (d.me_p===0) {
                                d.me_p = 100*d.me/s.network_size;
                            }
                        }
                        d.avg += parseInt(s[d.prop]);
                    }

                });
            });
            var num_users = summaries.length;
            angular.forEach(inst.user.stats, function(d) {
                if (d.avg_p===0) {
                    d.avg_p = 100*d.avg/total_profiles;
                }
                d.avg = d.avg/num_users;
            });
        };

      inst.login = function(gridOptions) {
        var uniqueSuffix = "?" + new Date().getTime();
        var php_script = "lti_login.php";
        var params = {};
        $http({method: 'POST',
          url: inst.appDir + 'php/' + php_script + uniqueSuffix,
          data: params,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).
            success(function(data) {
              if (data.login_error === "NONE") {
                  inst.user.priv_level = parseInt(data.priv_level);
                  inst.user.user_name = data.full_name;
                  inst.user.net_id = data.net_id;
                  angular.forEach(data.profiles, function(p) {
                      if (p.more_senior === '1') {
                          p.level = '1';
                      } else if (p.same_level === '1') {
                          p.level = '0';
                      } else {
                          p.level = '-1';
                      }
                  });
                  var my_profile = {};
                  my_profile.profile_id = 0;
                  my_profile.me = true;
                  my_profile.fixed = true;
                  my_profile.x = 480;
                  my_profile.y = 250;
                  my_profile.full_name = data.full_name;
                  my_profile.same_school = '1';
                  my_profile.same_industry = '1';
                  my_profile.same_level = '1';
                  my_profile.same_gender = '1';
                  my_profile.same_nationality = '1';
                  my_profile.same_ethnicity = '1';
                  my_profile.same_skill = '1';
                  inst.user.profiles = data.profiles;
                  inst.user.profiles.unshift(my_profile);
                  inst.user.connections = data.connections;
                  inst.makeNetwork();
                  if (inst.user.priv_level > 1) {
                      inst.admin.summaries = data.summaries;
                      gridOptions.data = data.summaries;
                  }
                  initStats(data.summaries);

              } else {
                inst.user.loginError =  data.login_error;
              }
            }).
            error(function(data, status) {
              inst.user.loginError =  "Error: " + status + " Sign-in failed. Check your internet connection";
            });
      };

      inst.addProfile = function(profile) {
        if (profile.level == '1') {
          profile.more_senior = 1;
          profile.same_level = 0;
          profile.more_junior = 0;
        } else if (profile.level == '0') {
          profile.more_senior = 0;
          profile.same_level = 1;
          profile.more_junior = 0;
        } else {
          profile.more_senior = 0;
          profile.same_level = 0;
          profile.more_junior = 1;
        }
        var php_script = "addProfile.php";
        var uniqueSuffix = "?" + new Date().getTime();
        var db_call = $http({method: 'POST',
          url: inst.appDir + 'php/' + php_script + uniqueSuffix,
          data: profile,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
          return db_call;
      };

        inst.updateProfile = function(profile) {
            if (profile.level == '1') {
                profile.more_senior = 1;
                profile.same_level = 0;
                profile.more_junior = 0;
            } else if (profile.level == '0') {
                profile.more_senior = 0;
                profile.same_level = 1;
                profile.more_junior = 0;
            } else {
                profile.more_senior = 0;
                profile.same_level = 0;
                profile.more_junior = 1;
            }
            var php_script = "updateProfile.php";
            var uniqueSuffix = "?" + new Date().getTime();
            var db_call = $http({method: 'POST',
                url: inst.appDir + 'php/' + php_script + uniqueSuffix,
                data: profile,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            return db_call;
        };

        inst.addConnection = function(params) {
            var php_script = "addConnection.php";
            var uniqueSuffix = "?" + new Date().getTime();
            var db_call = $http({method: 'POST',
                url: inst.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            return db_call;
        };

        inst.deleteConnection = function(params) {
            var php_script = "deleteConnection.php";
            var uniqueSuffix = "?" + new Date().getTime();
            $http({method: 'POST',
                url: inst.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                if (!data) {
                    alert("Error removing connection.");
                } else {
                    var i = _.indexOf(inst.user.connections, params);
                    inst.user.connections.splice(i,1);
                }
            }).
                error(function(data, status) {
                    alert("Error: " + status + " Remove connection failed. Check your internet connection");
                });
        };

        inst.getNetwork = function(net_id, full_name) {
            inst.user.profiles = [];
            var php_script = "getNetwork.php";
            var params = {net_id:net_id};
            var uniqueSuffix = "?" + new Date().getTime();
            $http({method: 'POST',
                url: inst.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                if (!data) {
                    alert("Get user network failed.");
                } else {
                    angular.forEach(data.profiles, function(p) {
                        if (p.more_senior === '1') {
                            p.level = '1';
                        } else if (p.same_level === '1') {
                            p.level = '0';
                        } else {
                            p.level = '-1';
                        }
                    });
                    var my_profile = {};
                    my_profile.profile_id = 0;
                    my_profile.me = true;
                    my_profile.fixed = true;
                    my_profile.x = 480;
                    my_profile.y = 250;
                    my_profile.full_name = full_name;
                    my_profile.same_school = '1';
                    my_profile.same_industry = '1';
                    my_profile.same_level = '1';
                    my_profile.same_gender = '1';
                    my_profile.same_nationality = '1';
                    my_profile.same_ethnicity = '1';
                    my_profile.same_skill = '1';
                    inst.user.profiles = data.profiles;
                    inst.user.profiles.unshift(my_profile);
                    inst.user.connections = data.connections;
                    inst.makeNetwork();
                    inst.user.net_id = net_id;
                    initStats(inst.admin.summaries);
                }
            }).
                error(function(data, status) {
                    alert("Error: " + status + " Get user network failed. Check your internet connection");
                });
        };

        inst.deleteNetwork = function(row, gridData) {
            var php_script = "deleteNetwork.php";
            var params = {};
            params.net_id = row.net_id;
            var uniqueSuffix = "?" + new Date().getTime();
            $http({method: 'POST',
                url: inst.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data) {
                if (!data) {
                    alert("Error deleting network.");
                } else {
                    var i = _.indexOf(gridData, row);
                    gridData.splice(i,1);
                }
            }).
                error(function(data, status) {
                    alert("Error: " + status + " Remove connection failed. Check your internet connection");
                });
        };

        inst.deleteProfile = function(profile) {
            var php_script = "deleteProfile.php";
            var params = {};
            params.profile_id = profile.profile_id;
            var uniqueSuffix = "?" + new Date().getTime();
            var db_call = $http({method: 'POST',
                url: inst.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            return db_call;
        };

      return inst;
  });
