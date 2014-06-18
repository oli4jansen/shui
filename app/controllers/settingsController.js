app.controller("settingsController", function($scope, $rootScope, userFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Settings.';
	$rootScope.menuState = 'settings';

	$scope.userData = userFactory.userData;

	$scope.init = function() {
		console.log($scope.userData);
	};

	$scope.update = function(name, emailNotifications) {
		console.log($scope.userData);
		userFactory.update(name, emailNotifications, function(error){
			if(error) {
				alert(error);
			}else{
				alert('Your settings were saved.');
			}
		});
	};

});