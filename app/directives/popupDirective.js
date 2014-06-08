app.directive('popup', function($rootScope, $timeout) {
  return {
    restrict: 'E',
    scope: {
      data: '=data'
    },
    templateUrl: 'app/views/popup.html',
    link: function(scope, element, attrs) {
      scope.show = true;

      scope.close = function() {
        $rootScope.popup = false;
      };

      scope.formData = {};

      scope.action = function() {
        if(scope.data.head.callback) {
          if(scope.data.head.callbackData) {

            for(var i=0;i < document.getElementById('popup-body').elements.length;i++) {
              var item = document.getElementById('popup-body').elements[i];
              scope.formData[item.name] = item.value;
            }

            scope.data.head.callback(scope.formData);
          }else{
            scope.data.head.callback();
          }
        }else{
          $rootScope.popup = false;
        }
      }
    }
  }
});