app.controller("signInController", function($scope, $rootScope, $routeParams, userFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Please sign in';
	$rootScope.menuState = 'signin';

	$scope.formData = {};

	$scope.init = function() {
		if($routeParams.action) {
			userFactory.signOut();
		}else if($routeParams.email && $routeParams.code) {
			$scope.showResetPassword = true;
			$rootScope.pageTitle = 'Choose a new password.';
		}else{
			var redirect = $routeParams.redirect || false;
			userFactory.checkAuth(redirect);
		}
	};

	$scope.signIn = function() {
		if($scope.formData.email && $scope.formData.password) {

			var redirect = $routeParams.redirect || false;

			$rootScope.loading = true;

			userFactory.signIn($scope.formData.email, $scope.formData.password, redirect);
		}else{
			alert('Please fill in all fields.');
		}
	};

	$scope.forgotPassword = function() {
		if($routeParams.email && $routeParams.code) {
			if($scope.formData.password && $scope.formData.password !== '') {
				$rootScope.loading = true;
				userFactory.resetPassword($routeParams.email, $scope.formData.password, $routeParams.code, function(err) {
					$rootScope.loading = false;
					if(!err) {
						alert('Your new password has been set!');
						$rootScope.navigate('/');
					}else{
						alert('Something went wrong on our side. We\'re sorry.');
						console.log(err);
					}
				});
			}
		}else{
			$rootScope.pageTitle = 'Request a password reset.';
			if($scope.showForgotPassword && $scope.formData.email && $scope.formData.email !== '') {
				$rootScope.loading = true;
				userFactory.requestResetPassword($scope.formData.email, function(err) {
					$rootScope.loading = false;
					if(!err) {
						alert('We\'ve sent you an email with further instructions.');
						$rootScope.navigate('/');
					}else{
						alert('Something went wrong on our side. We\'re sorry.');
					}
				});
			}else{
				$scope.showForgotPassword = true;
			}
		}
	};

});