angular.module('webApp')
    .controller('LoginCtrl', function ($scope, $window, djangoAuth, Validate) {
        $scope.model = {'email':'','password':''};
        $scope.complete = false;

        $scope.login = function(formData) {
            $scope.errors = [];
            Validate.form_validation(formData, $scope.errors);
            if(!formData.$invalid) {
                djangoAuth.login($scope.model.email, $scope.model.password)
                    .then(function(data) {
                        // success case
                        $window.location.reload();
                    }, function(data) {
                        // error case
                        $scope.errors = data;
                        if (data.status == 401) {
                            $scope.error = 'Email and/or password incorrect.';
                        }
                    });
            }
        }
    });