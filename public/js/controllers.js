var urlApp = angular.module('urlApp', ['urlServices', 'truncate']);

urlApp.controller('UrlListCtrl', ['$scope', 'URL', function($scope, URL) {
    $scope.urls = URL.query();

    $scope.addUrl = function(url) {
        if (url && url.length > 0) {
            URL.add({url:url}, function(newUrl){ 
                $scope.urls.splice(0, 0, newUrl);
                $scope.newUrl = newUrl;

                setTimeout(function() {  // Wait for the model to be updated before highlighting.
                    $('#txtShortUrl').focus();
                    $('#txtShortUrl').select();
                }, 250);

            });
        }
    }

    $scope.removeUrl = function(shortCode, idx) {
        if (shortCode && shortCode.length > 0) {
            URL.remove({shortCode:shortCode}, function() {
                $scope.urls.splice(idx, 1);
            });
        }
    }
}]);

