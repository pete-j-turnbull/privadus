angular.module("webApp")
    .controller("CampaignsListCtrl", ['$state', '$scope', 'Restangular', function ($state, $scope, Restangular) {
        $scope.viewLoading = true;

        $scope.model = {
            campaigns_active: [{name: 'Tesco', id: 1}, {name: 'Morrisons', id: 2}, {name: 'Sainsburys', id: 3}],
            campaigns_inactive: []
        }

        Restangular.all('campaign').getList()
            .then(function (campaigns) {
                $scope.model.campaigns = campaigns;
                $scope.viewLoading = false;
            }, function(reason) {

            });
    }]);