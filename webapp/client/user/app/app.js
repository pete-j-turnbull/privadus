angular.module("webApp", [
    "ui.bootstrap",
    "ui.router",
    "restangular",
    "ui.sortable",
    "ngFx",
    "flow",
    "ngCookies",
    "ngResource",
    "ngSanitize"
]);
angular.module('webApp')
    .config(function (RestangularProvider) {
        RestangularProvider.setBaseUrl('/api/v1');
        RestangularProvider.addResponseInterceptor(function (response, operation) {
            if (operation === 'getList') {
                var newResponse = response.objects;
                newResponse.paging = response.paging;
                newResponse.error = response.error;
                return newResponse;
            }
            return response;
        });
    })
    .config(['flowFactoryProvider', function (flowFactoryProvider) {
        flowFactoryProvider.defaults = {
            target: '/api/v1/advert/upload',
            testChunks: false
        };
    }])
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('dash', {
                url: '/dash',
                templateUrl: '/static/user/app/partials/dash.html',
                controller: "DashCtrl",
                animation: {
                    enter: 'fx-fade-down',
                    ease: 'cubic',
                    speed: 1200
                }
            })
            .state('help', {
                url: '/help',
                templateUrl: '/static/user/app/partials/help.html',
                controller: "HelpCtrl",
                animation: {
                    enter: 'fx-fade-down',
                    ease: 'cubic',
                    speed: 1200
                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: '/static/user/app/partials/settings.html',
                controller: "SettingsCtrl",
                animation: {
                    enter: 'fx-fade-down',
                    ease: 'cubic',
                    speed: 1200
                }
            })

            .state('campaigns_list', {
                url: '/campaigns',
                templateUrl: '/static/user/app/partials/campaigns.list.html',
                controller: "CampaignsListCtrl",
                animation: {
                    enter: 'fx-fade-down',
                    ease: 'cubic',
                    speed: 1200
                }
            })
            .state('campaigns_new', {
                url: '/campaigns_new',
                templateUrl: '/static/user/app/partials/campaigns.new.html',
                controller: "CampaignsNewCtrl",
                animation: {
                    enter: 'fx-fade-down',
                    ease: 'cubic',
                    speed: 1200
                }
            })
            .state('campaigns_detail', {
                url: '/campaigns/:cid',
                templateUrl: '/static/user/app/partials/campaigns.detail.html',
                controller: "CampaignsDetailCtrl",
                animation: {
                    enter: 'fx-fade-down',
                    ease: 'cubic',
                    speed: 1200
                }
            })
            .state('agents_new', {
                url: '/agents_new/:cid',
                templateUrl: '/static/user/app/partials/agents.new.html',
                controller: "AgentsNewCtrl",
                animation: {
                    enter: 'fx-fade-down',
                    ease: 'cubic',
                    speed: 1200
                }
            })
            .state('agents_detail', {
                url: '/agents/:aid',
                templateUrl: '/static/user/app/partials/agents.detail.html',
                controller: "AgentsDetailCtrl",
                animation: {
                    enter: 'fx-fade-down',
                    ease: 'cubic',
                    speed: 1200
                }
            })
            .state('wallet', {
                url: '/wallet',
                templateUrl: '/static/user/app/partials/wallet.html',
                controller: "WalletCtrl",
                animation: {
                    enter: 'fx-fade-down',
                    ease: 'cubic',
                    speed: 1200
                }
            });

    })
    .run(['$state', function ($state) {
        $state.transitionTo('dash');
    }]);