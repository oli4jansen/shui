app.controller("signInController", function($scope, $rootScope, $routeParams, userFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Please sign in.';
	$rootScope.menuState = 'signin';

	$scope.formData = {};

	$scope.init = function() {
		if($routeParams.action) {
			userFactory.signOut();
		}else{
			var redirect = $routeParams.redirect || false;
			userFactory.checkAuth(redirect);
		}
	};

	$scope.signIn = function() {
		if($scope.formData.email && $scope.formData.password) {

			var redirect = $routeParams.redirect || false;

			$scope.loading = true;
			$rootScope.pageTitle = 'Signing you in..';

			userFactory.signIn($scope.formData.email, $scope.formData.password, redirect);
		}else{
			alert('Please fill in all fields.');
		}
	};

});