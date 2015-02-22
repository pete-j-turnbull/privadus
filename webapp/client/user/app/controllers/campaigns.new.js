angular.module("webApp")
    .controller("CampaignsNewCtrl", ['$state', '$scope', 'Restangular', '$modal', 'CampaignModel', '$q',
        function ($state, $scope, Restangular, $modal, CampaignModel, $q) {

            $scope.init_model = function () {
                $scope.model = CampaignModel.model;
            };

            $scope.new_advert = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/static/user/app/partials/new_advert.html',
                    backdrop: 'static',
                    controller: function ($scope, $modalInstance, CampaignModel) {
                        $scope.init_model = function () {
                            $scope.model = {advert: ''};
                        };
                        $scope.success = function (file, message) {
                            file.name = JSON.parse(message).image_path;
                            file.complete = true;
                            $scope.uploaded = true;
                            $scope.model.advert = file.name;
                        };
                        $scope.add = function () {
                            CampaignModel.add_advert($scope.model.advert);
                            
                        };
                    }
                });
            }

            $scope.new_voucher = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/static/user/app/partials/new_voucher.html',
                    backdrop: 'static',
                    controller: function ($scope, $modalInstance, CampaignModel) {
                        $scope.init_model = function () {
                            $scope.model = {voucher: ''};
                        };
                        $scope.success = function (file, message) {
                            file.name = JSON.parse(message).image_path;
                            file.complete = true;
                            $scope.uploaded = true;
                            $scope.model.voucher = file.name;
                        };
                        $scope.add = function () {
                            CampaignModel.add_advert($scope.model.voucher);
                        };
                    }
                });
            }
    }])
    .factory("CampaignModel",
        function() {
            return {
                reset: function () {
                    this.model = {name: '', description: '', ads: {}, vouchers: {}};
                },
                add_advert: function (advert) {
                    this.model.ads += advert;
                },
                add_voucher: function (voucher) {
                    this.model.vouchers += voucher;
                },
                model: {
                    name: '',
                    description: '',
                    ads: {},
                    vouchers: {}
                }
            };
        });