angular.module("webApp")
    .controller("AgentsDetailCtrl", ['$state', '$scope', 'Restangular', '$stateParams', '$q',
        function ($state, $scope, Restangular, $stateParams, $q) {
            $scope.viewLoading = true;
            $scope.model = {agent: ''};

            Restangular.one('agent', $stateParams.aid).get().then(
                function (agent) {
                    $scope.model.agent = agent;
                    $scope.viewLoading = false;
                }, function (reason) {
                    $scope.failed = true;
                    $scope.error = reason;
                });
        }]);