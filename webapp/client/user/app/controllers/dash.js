angular.module("webApp")
    .controller("DashCtrl", ['$state', '$scope', 'Restangular', function ($state, $scope, Restangular) {
        $scope.viewLoading = true;

        $scope.model = {
            campaigns_top: [],
            campaigns_warn: []
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
                name: 'Portfolio'
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