angular.module("webApp")
    .controller("AgentsListCtrl", ['$state', '$scope', 'Restangular', function ($state, $scope, Restangular) {
        $scope.viewLoading = true;

        $scope.model = {
            agents: ''
        }

        Restangular.all('agent').getList()
            .then(function (agents) {
                $scope.model.agents = agents;
                $scope.viewLoading = false;
            }, function(reason) {

            });
    }]);