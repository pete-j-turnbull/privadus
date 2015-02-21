angular.module("webApp")
    .controller("DashCtrl", ['$state', '$scope', 'Restangular', function ($state, $scope, Restangular) {
        $scope.viewLoading = true;

        $scope.model = {
            campaigns: '',
            agents: ''
        }   

        Restangular.all('campaign').getList()
            .then(function (campaigns) {
                $scope.model.campaigns = campaigns;
                $scope.viewLoading = false;
            }, function(reason) {

            });
        Restangular.all('agent').getList().then(
            function (agents) {
                $scope.model.agents = agents;
            }, function(reason) {

            });

    }]);