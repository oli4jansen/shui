app.controller("verificationController", function($scope, $rootScope, $routeParams, userFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Thank you for signing up';
	$rootScope.menuState = 'signin';

	$scope.loading = false;

	$scope.init = function() {
		if($routeParams.code && $routeParams.email) {
			$rootScope.pageTitle = 'Verifying..';
			userFactory.verify($routeParams.email, $routeParams.code, function(error) {
				if(error) {
					console.log(error);
					$scope.loading = false;
					alert('Something went wrong.');
				}else{
					$rootScope.navigate("signin");
				}
			});
			$scope.loading = true;
		}
	};

});