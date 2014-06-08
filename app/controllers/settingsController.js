app.controller("settingsController", function($scope, $rootScope, userFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Settings.';
	$rootScope.menuState = 'settings';

	$scope.userData = userFactory.userData;

	$scope.init = function() {

	};

});