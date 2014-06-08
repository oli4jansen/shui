app.controller("menuController", function($scope, $rootScope, userFactory, notificationFactory){

	$scope.init = function() {
		notificationFactory.updateNotificationCount();
	};

});