angular.module("webApp")
    .controller("CampaignsDetailCtrl", ['$state', '$scope', 'Restangular', '$stateParams', '$q',
        function ($state, $scope, Restangular, $stateParams, $q) {
            $scope.viewLoading = true;
            $scope.model = {campaign: '', campaign_adverts: '', campaign_t: {name: 'Ocado Campaign', description: 'New Campaign for Ocado'}};

            $q.all([Restangular.one('campaign', $stateParams.cid).get(), Restangular.all('advert').getList()]).then(
                function (data) {
                    $scope.model.campaign = data[0];
                    $scope.model.campaign_adverts = data[1];
                    $scope.viewLoading = false;
                });

            $scope.newAgent = function () {
                 $state.transitionTo('agents_new', {'cid': $scope.model.campaign.id});
            };

            $scope.dataset = [
            {
                'day': '2015-01-02',
                'p_health': 102
            },
            {
                'day': '2015-01-03',
                'p_health': 105
            },
            {
                'day': '2015-01-04',
                'p_health': 106
            },
            {
                'day': '2015-01-05',
                'p_health': 108
            },
            {
                'day': '2015-01-06',
                'p_health': 109
            },
            {
                'day': '2015-01-07',
                'p_health': 110
            },
            {
                'day': '2015-01-08',
                'p_health': 111
            },
            {
                'day': '2015-01-09',
                'p_health': 111
            },
            {
                'day': '2015-01-10',
                'p_health': 112
            },
            {
                'day': '2015-01-11',
                'p_health': 112
            },
            {
                'day': '2015-01-12',
                'p_health': 111
            }
        ];


        $scope.options = {
            rows: [{
                key: 'p_health',
                name: 'Campaign'
            }],
            size: {
                height: 365
            },
            xAxis: {
                key: 'day',
                displayFormat: '%Y-%m-%d'
            }
        };

        }]);