angular.module("webApp")
    .controller("CampaignsNewCtrl", ['$state', '$scope', 'Restangular', '$modal', 'CampaignModel', '$q',
        function ($state, $scope, Restangular, $modal, CampaignModel, $q) {

            CampaignModel.init();
            $scope.model = {name: '', description: '', add_agent: false, ads: {}, vouchers: {}};

            var add_ad = function (advert) {
                $scope.model.ads += advert;
                $scope.model.add_agent = true;
            };
            var add_voucher = function (voucher) {
                $scope.model.voucher += voucher;
                $scope.model.add_agent = true;
            };

            $scope.new_advert = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/static/user/app/partials/new_advert.html',
                    backdrop: 'static',
                    controller: function ($scope, $modalInstance, CampaignModel) {
                        $scope.model = {advert: ''};
                        $scope.success = function (file, message) {
                            file.name = JSON.parse(message).image_path;
                            file.complete = true;
                            $scope.uploaded = true;
                            $scope.model.advert = file.name;
                        };
                        $scope.add = function () {
                            add_ad($scope.model.advert);
                            $modalInstance.close();
                        };
                    }
                });
            };

            $scope.new_voucher = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/static/user/app/partials/new_voucher.html',
                    backdrop: 'static',
                    controller: function ($scope, $modalInstance, CampaignModel) {
                        $scope.model = {voucher: ''};
                        $scope.success = function (file, message) {
                            file.name = JSON.parse(message).image_path;
                            file.complete = true;
                            $scope.uploaded = true;
                            $scope.model.voucher = file.name;
                        };
                        $scope.add = function () {
                            add_voucher($scope.model.voucher);
                            $modalInstance.close();
                        };
                    }
                });
            };
            
            $scope.create_campaign = function () {

            }
    }])
    .factory("CampaignModel",
        function($rootScope) {
            var model;
            var init = function () {
                model = {name: '', description: '',  add_agent: false, ads: {}, vouchers: {}};
            };
            var update = function (newModel) {
                model = newModel;
                broadcast(model);
            };
            var broadcast = function () {
                $rootScope.$broadcast('CampaignModel.update', model);
            };
            var add_advert = function (advert) {
                model.ads += advert;
            };
            var add_voucher = function (voucher) {
                model.vouchers += voucher;
            };

            return {
                init: init,
                update: update,
                broadcast: broadcast,
                add_advert: add_advert,
                add_voucher: add_voucher
            };
        });