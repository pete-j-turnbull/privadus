var webAppModule = angular.module('webApp', [
    'ui.bootstrap',
    'ui.router',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate'
]);
webAppModule.run(function(djangoAuth) {
    djangoAuth.initialize('/api/v1/user', true);
});


webAppModule.controller('LoginWindowCtrl', function ($scope, $modal) {

  $scope.open = function () {
    var modalInstance = $modal.open({
      templateUrl: '/static/visitor/app/views/login.html',
      controller: 'ModalInstanceCtrl'
    });
  };
});
webAppModule.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
