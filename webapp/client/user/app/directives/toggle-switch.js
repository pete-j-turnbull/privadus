angular.module('webApp')
    .directive('boottoggle', function () {
        return {
            restrict: 'C',
            scope: {
                dataOn: '=',
                dataOff: '=',
                model: '@'
            },
            link: function (scope, elem, attr) {
                $(elem).bootstrapToggle({
                    on: scope.dataOn,
                    off: scope.dataOff,
                    onstyle: 'success',
                    offstyle: 'danger'
                });

                scope.$watch(scope.model, function (value) {
                    if (value) {
                        $(elem).bootstrapToggle('on');
                    } else {
                        $(elem).bootstrapToggle('off');
                    }
                });
                $(elem).change(function () {
                    if ($(this).prop('checked')) {
                        scope.model = true;
                    } else {
                        scope.model = false;
                    }
                })

            }
        }
    });