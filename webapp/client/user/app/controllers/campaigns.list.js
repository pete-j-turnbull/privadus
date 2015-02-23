angular.module("webApp")
    .controller("CampaignsListCtrl", ['$state', '$scope', 'Restangular', function ($state, $scope, Restangular) {
        $scope.viewLoading = true;

        $scope.model = {
            campaigns_active: [{name: 'Active 1', id: 1}, {name: 'Active 2', id: 2}, {name: 'Active 3', id: 3}],
            campaigns_inactive: [{name: 'Inactive 1', id: 4}]
        }

        Restangular.all('campaign').getList()
            .then(function (campaigns) {
                $scope.model.campaigns = campaigns;
                $scope.viewLoading = false;
            }, function(reason) {

            });
    }]);