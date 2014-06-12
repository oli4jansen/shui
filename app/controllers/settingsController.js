app.controller("settingsController", function($scope, $rootScope, userFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Settings.';
	$rootScope.menuState = 'settings';

	$scope.userData = userFactory.userData;

	$scope.init = function() {

	};

	$scope.update = function(name) {
		userFactory.update(name, function(error){
			if(error) {
				alert(error);
			}else{
				alert('Your settings were saved.');
			}
		});
	};

});