angular.module("webApp")
    .controller("AgentsListCtrl", ['$state', '$scope', 'Restangular', function ($state, $scope, Restangular) {
        $scope.viewLoading = true;

        $scope.model = {
            agents_active: [{name: 'Active 1', id: 1}, {name: 'Active 2', id: 2}, {name: 'Active 3', id: 3}],
            agents_inactive: [{name: 'Inactive 1', id: 4}]
        }

        Restangular.all('agent').getList()
            .then(function (agents) {
                $scope.model.agents = agents;
                $scope.viewLoading = false;
            }, function(reason) {

            });
    }]);