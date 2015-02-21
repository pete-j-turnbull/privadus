angular.module("webApp")
    .controller("CampaignsListCtrl", ['$state', '$scope', 'Restangular', function ($state, $scope, Restangular) {
        $scope.viewLoading = true;

        $scope.model = {
            campaigns: ''
        }

        Restangular.all('campaign').getList()
            .then(function (campaigns) {
                $scope.model.campaigns = campaigns;
                $scope.viewLoading = false;
            }, function(reason) {

            });
    }]);