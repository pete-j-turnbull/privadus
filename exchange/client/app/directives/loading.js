angular.module("webApp")
  .directive("myLoadingSpinner", function() {
    return {
      restrict: 'A',
      replace: true,
      transclude: true,
      scope: {
          loading: '=myLoadingSpinner',
          loadingError: '='
      },
        templateUrl: '/static/user/app/directives/templates/loading.html',
        link: function(scope, element, attrs) {
            var opts = {
                lines: 10, // The number of lines to draw
                length: 10, // The length of each line
                width: 8, // The line thickness
                radius: 20, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1.2, // Rounds per second
                trail: 45, // Afterglow percentage
                shadow: true, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: '50%', // Top position relative to parent
                left: '50%' // Left position relative to parent
            };
            var spinner = new Spinner(opts).spin();
            var loadingContainer = element.find('.my-loading-spinner-container')[0];
            loadingContainer.appendChild(spinner.el);
        }
    };
  });