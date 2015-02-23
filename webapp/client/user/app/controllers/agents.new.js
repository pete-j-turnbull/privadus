angular.module("webApp")
    .controller("AgentsNewCtrl", ['$state', '$scope', 'Restangular', '$modal', 'AgentModel', 'DemographicModel', 'MatchService', '$stateParams', '$q',
        function ($state, $scope, Restangular, $modal, AgentModel, DemographicModel, MatchService, $stateParams, $q) {
            $scope.a_model = AgentModel.model;
            $scope.d_model = DemographicModel.model;
            $scope.errors = [];

            var createAgent = function (model) {
                return $q(function (resolve, reject) {
                    var agents = Restangular.all('agent');
                    Restangular.one('campaign', $stateParams.cid).get().then(
                        function (campaign) {
                            var agentModel = {campaign: campaign, name: model.name, budget: model.budget,
                                audience: model.audience, active: model.active};
                            agents.post(agentModel).then(
                                function (new_agent) {
                                    resolve(new_agent);
                                }, function () {
                                    reject('Failed to create agent.')
                                });
                        });
                });
            };

            var createDemographic = function (agent_obj, model) {
                return $q(function (resolve, reject) {
                    var demographics = Restangular.all('demographic');
//                    Get lat and long
                    var lat = 0;
                    var long = 0;
                    var demographicModel = {agent: agent_obj, min_age: model.min_age, max_age: model.max_age,
                        latitude: lat, longitude: long, radius: model.radius};
                    demographics.post(demographicModel).then(
                        function (new_demographic) {
                            resolve();
                        }, function () {
                            reject('Failed to create demographic.')
                        })
                })
            };

            $scope.create_agent = function () {
                $state.transitionTo('agents_detail', {'aid': 1});
            }


            $scope.findMatches = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/static/user/app/partials/findMatchesAgent.html',
                    backdrop: 'static',
                    controller: function ($scope, $modalInstance) {
                        $scope.a_model = AgentModel.model;
                        $scope.d_model = DemographicModel.model;
                        $scope.notChosenDesiredMatches = function () {
                            return !($scope.a_model.audience > 0);
                        };

                        MatchService.findMatches().then(function (noMatches) {
                            $scope.d_model.matches = noMatches;
                            $scope.searchFinished = true;
                        }, function () {

                        });

                        $scope.ok = function () {
                            createAgent($scope.a_model).then(
                                function (agent) {
                                    createDemographic(agent, $scope.d_model).then(
                                        function (demographic) {

                                        })
                                });
                            $modalInstance.close();
                        }

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                });
            };
        }])
    .factory("AgentModel", function () {
        return {
            reset: function () {
                this.model = {name: '', audience:0, budget:0, active: true};
            },
            model: {
                name: '',
                audience: 0,
                budget: 0,
                active: true
            }
        };
    })
    .factory("DemographicModel", function () {
        return {
            reset: function () {
                this.model = {matches: 0, min_age: 0, max_age: 0, location: '', radius: 0, gender: ''};
            },
            model: {
                matches: 0,
                min_age: 0,
                max_age: 0,
                location: '',
                radius: 0,
                gender: 'Male'
            }
        };
    });