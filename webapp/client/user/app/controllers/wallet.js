angular.module("webApp")
    .controller("WalletCtrl", ['$state', '$scope', 'Restangular', '$modal', '$q', '$http',
        function ($state, $scope, Restangular, $modal, $q, $http) {
            $scope.viewLoading = true;
            $scope.model = {wallet:''};
            $http.get("/api/v1/profile/wallet")
                .success(function (data, status, headers, config) {
                    $scope.model.wallet = data.data;
                    $scope.viewLoading = false;
                });

    }]);