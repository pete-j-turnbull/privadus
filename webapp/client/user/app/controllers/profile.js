angular.module("webApp")
    .controller("ProfileCtrl", ['$state', '$scope', 'Restangular', '$timeout',
        function ($state, $scope, Restangular, $timeout) {
        $scope.viewLoading = true;

        $scope.model = {
            profile: ''
        }

        var data = {
            email: 'pete@privadus.com'
        };

        $timeout(function () {
            $scope.model.profile = data;
            $scope.viewLoading = false;
        }, 1000);

    }]);