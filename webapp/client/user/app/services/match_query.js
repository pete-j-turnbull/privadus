angular.module('webApp')
    .factory('MatchService', ['$q', '$timeout', function ($q, $timeout) {
        return {
            findMatches: function (demographic) {
                return $q(function (resolve, reject) {
                    var noMatches = 100;
                    return $timeout(function () {
                        resolve(noMatches);
                    }, 3000);
                });
            }
        };
    }]);