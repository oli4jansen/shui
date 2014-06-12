app.controller("homeController", function($scope, $rootScope, localStorageService, $timeout){

	// Titel van deze pagina
	$rootScope.pageTitle = false;
	$rootScope.menuState = 'home';

	$scope.currentWord = 'project';
	$scope.words = ['project', 'research', 'collaborations', 'school assignments', 'graduation project'];
	$scope.animate = false;

	$scope.init = function() {
		if($rootScope.signedIn) $rootScope.navigate('/projects');

		$scope.switchWord();
	};

	$scope.switchWord = function() {
		$timeout(function() {
			$scope.animate = true;
			$timeout(function() {
				$scope.animate = false;
			}, 750);

			var index = $scope.words.indexOf($scope.currentWord);
			if(index+1 >= $scope.words.length) {
				$scope.currentWord = $scope.words[0];
			}else{
				$scope.currentWord = $scope.words[index+1];
			}
			$scope.switchWord();
		}, 2000);
	};

});