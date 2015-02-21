angular.module("webApp")
    .controller("CampaignsNewCtrl", ['$state', '$scope', 'Restangular', '$modal', 'CampaignModel', '$q',
        function ($state, $scope, Restangular, $modal, CampaignModel, $q) {
            $scope.init_model = function ($flow) {
                CampaignModel.init_flow($flow);
                $scope.model = CampaignModel.model;
                $scope.files = CampaignModel.files;
            };

            var create = function() {
                return $q(function (resolve, reject) {
                    var campaigns = Restangular.all('campaign');
                    campaigns.post($scope.model).then(
                        function (new_campaign) {
                            campaignAdded = 1;
//                        Add new advert objects with campaign id as their foreign key
                            addAdverts(new_campaign).then(function () {
                                resolve(new_campaign.id);
                                CampaignModel.reset();
                            }, function () {
                                reject('Failed to upload adverts.');
                            })
                        }),
                        function (reason) {
                            reject('Failed to upload campaign.')
                        };
                });
            };

            var noAdsPosted = 0;
            var campaignAdded = 0;
            var postProgress = function () {
                var fileProg = 0;
                if ($scope.files.length == 0) {
                    fileProg = 1;
                } else {
                    fileProg = noAdsPosted / $scope.files.length;
                }
                return campaignAdded*25 + fileProg*75;
            };
            var postFinished = function () {
                return noAdsPosted == $scope.files.length && campaignAdded == 1;
            }
            var addAdverts = function (campaign) {
                if ($scope.files.length == 0) {
                    return $q(function (resolve, reject) {
                        resolve();
                    })
                }
                var adverts = Restangular.all('advert');

                return $q(function (resolve, reject) {
                    for (var i = 0; i < $scope.files.length; i++) {
                        var advert = {campaign:campaign, image_path:$scope.files[i].name};
                        adverts.post(advert).then(function () {
                            noAdsPosted += 1;
                            if (i == $scope.files.length) {
                                resolve();
                            }
                        }, function () {
                            reject();
                        })
                    }
                });
            };

            $scope.promptForAgent = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/static/user/app/partials/promptForAgent.html',
                    backdrop: 'static',
                    controller: function ($scope, $modalInstance) {
//                        Immediately start adding the adverts
                        var createPromise = create();

                        $scope.progress = postProgress;
                        $scope.stillCreating = function () {
                            return !postFinished();
                        };
                        $scope.finish = function () {
                            createPromise.then(function (campaign_id) {
                                $state.transitionTo('campaigns_detail', {'cid': campaign_id});
                                $modalInstance.close();
                            }, function (reason) {
                                $scope.error = 'Failed to create campaign: ' + reason;
                            })

                        };
                        $scope.addAgent = function () {
                            createPromise.then(function (campaign_id) {
                                $state.transitionTo('agents_new', {'cid': campaign_id});
                                $modalInstance.close();
                            }, function (reason) {
                                $scope.error = 'Failed to create campaign: ' + reason;
                            })
                        }
                        $scope.cancel = function () {
//                            Need to find some way of deleting the campaign now ...
                            $scope.cancelled = true;

                            //$modalInstance.dismiss('cancel');
                        };
                    }
                });
            };

            $scope.stillUploading = function () {
                var file;
                for (file in $scope.files) {
                    if (file.complete == false) {
                        return true;
                    }
                }
                return false;
            };

    }])
    .controller('FileHandlerCtrl', ['$scope', 'CampaignModel',
        function ($scope, CampaignModel) {
            $scope.files = CampaignModel.files;
            $scope.$on('flow::fileAdded', function (event, $flow, file) {
//                File validation here
            })
            $scope.$on('flow::fileSuccess', function (event, $flow, file, msg) {
                file.name = JSON.parse(msg).image_path;
                file.complete = true;
            })
            $scope.isComplete = function (file) {
                return file.complete;
            }
    }])
    .factory("CampaignModel",
        function() {
            return {
                init_flow: function ($flow) {
                    this.files = $flow.files;
                },
                reset: function () {
                    this.model = {name: '', description: ''};
//                Flow reset
                },
                model: {
                    name: '',
                    description: ''
                },
                files: {}
            };
        });