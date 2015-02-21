angular.module('webApp')
    .controller('SignupCtrl', function ($scope, $window, djangoAuth, Validate) {
        $scope.model = {'name':'','organisation':'','email':'','password':'','password2':''};
        $scope.complete = false;
        $scope.signup = function(formData){
            $scope.errors = [];
            Validate.form_validation(formData,$scope.errors);
            if(!formData.$invalid){
                djangoAuth.register($scope.model.name, $scope.model.organisation, $scope.model.email, $scope.model.password)
                    .then(function(data){
                        // success case
                        $scope.complete = true;
                        $window.location.reload();
                    },function(data){
                        // error case
                        $scope.errors = data;
                    });
            }
        }
    });