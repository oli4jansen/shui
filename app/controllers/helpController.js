app.controller("helpController", function($scope, $rootScope, $routeParams, $location, $anchorScroll){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Guides and documentation';
	$rootScope.menuState = 'home';

	$scope.categories = [
		'notifications',
		'projects',
		'participants',
		'messages',
		'tasks',
		'files'
	];

	$scope.init = function() {

		if($routeParams.category && $scope.categories.indexOf($routeParams.category) > -1) {
			$scope.category = $routeParams.category;
			$rootScope.pageTitle =  $scope.category[0].toUpperCase() + $scope.category.slice(1);
			$rootScope.pageSubTitle = 'Guides and documentation';

    		$anchorScroll();
		}
	};

	$scope.$on("$destroy", function() {
		$rootScope.pageSubTitle = false;
	});

});