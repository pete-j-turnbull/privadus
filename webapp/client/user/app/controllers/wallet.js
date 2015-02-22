angular.module("webApp")
    .controller("WalletCtrl", ['$state', '$scope', 'Restangular', '$modal', '$q', '$http', '$timeout',
        function ($state, $scope, Restangular, $modal, $q, $http, $timeout) {
            $scope.viewLoading = true;
            $scope.model = {wallet:''};

            var data = {
                address: '2',
                balance: 5
            };

            $timeout(function () {
                $scope.model.wallet = data;
                $scope.viewLoading = false;
            }, 1000);


            /*$http.get("/api/v1/profile/wallet")
                .success(function (data, status, headers, config) {
                    $scope.model.wallet = data.data;
                    $scope.viewLoading = false;
                });
            */

    }]);