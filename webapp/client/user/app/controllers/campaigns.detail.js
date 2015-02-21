angular.module("webApp")
    .controller("CampaignsDetailCtrl", ['$state', '$scope', 'Restangular', '$stateParams', '$q',
        function ($state, $scope, Restangular, $stateParams, $q) {
            $scope.viewLoading = true;
            $scope.model = {campaign: '', campaign_adverts: ''};

            $q.all([Restangular.one('campaign', $stateParams.cid).get(), Restangular.all('advert').getList()]).then(
                function (data) {
                    $scope.model.campaign = data[0];
                    $scope.model.campaign_adverts = data[1];
                    $scope.viewLoading = false;
                });

            $scope.newAgent = function () {
                 $state.transitionTo('agents_new', {'cid': $scope.model.campaign.id});
            };
        }]);