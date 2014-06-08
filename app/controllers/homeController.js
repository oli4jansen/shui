app.controller("homeController", function($scope, $rootScope, localStorageService){

	// Titel van deze pagina
	$rootScope.pageTitle = false;
	$rootScope.menuState = 'home';

	$scope.init = function() {
		if($rootScope.signedIn) $rootScope.navigate('/projects');
	};

});