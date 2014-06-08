app.factory('userFactory', function($http, $rootScope, $location, $timeout, localStorageService) {

	var factory = {};

	$rootScope.signedIn = false;

	factory.userData = {};

	factory.checkAuth = function(redirect) {
		var token = localStorageService.get('token');
		var email = localStorageService.get('email');

		if(token !== undefined && token !== '' && token !== null && email !== undefined && email !== '' && email !== null) {
			/*
			1. Stuur token + email naar API

			2. API server met email de gegevens van gebruiker op, generate een token.

			3. API server checkt of tokens overeen komen.

			4a. Zo ja: stuur 200.
			4b. Zo nee: stuur 403.
			*/
			var response = {
				status: 200,
				data: {
					userData: {
						id: 1,
						name: 'Olivier Jansen',
						email: 'oli4jansen.nl@gmail.com'
					}
				}
			};

			if(response.status == 200) {
				factory.userData = response.data.userData;
				$rootScope.signedIn = true;
				$rootScope.navigate('projects');

				if(response.status == 201) {
					// Navigate to tutorial
					$rootScope.navigate('projects');
				}else if(redirect){
					console.log('Redirect to '+redirect);
					$location.path(redirect).search('redirect', null);
				}else{
					$rootScope.navigate('projects');
				}
			}
		}
	};

	factory.signIn = function(email, password, redirect) {
		/*
		1. Stuur email en password naar API

		2. API haalt wachtwoord op dat bij email hoort en checkt of deze klopt

		3a. Zo ja; API stuurt 200 + token naar client.
		3b. Zo nee; API stuurt 403 naar client.
		3c. Als email niet bestaat: API zet gegevens in database en stuurt 201 + token.

		4. Client bewaart de token in localStorage.

		5. Client stuurt de gebruiker naar de volgende pagina, op basis van status.
		*/

		var response = {
			status: 200,
			data: {
				token: 'abc',
				userData: {
					id: 1,
					name: 'Olivier Jansen',
					email: 'oli4jansen.nl@gmail.com'
				}
			}
		};

		$timeout(function(){

			if(response.status == 200 || response.status == 201) {

				factory.userData = response.data.userData;
				localStorageService.set('token', response.data.token);
				localStorageService.set('email', email);
				$rootScope.signedIn = true;

				if(response.status == 201) {
					// Navigate to tutorial
					$rootScope.navigate('projects');
				}else if(redirect){
					$rootScope.navigate('/'+redirect);
				}else{
					$rootScope.navigate('projects');
				}

			}else{
				alert('Ongeldige gegevens.');
			}

		}, 250);
	};

	factory.signOut = function(email, password, redirect) {
		localStorageService.set('token', null);
		localStorageService.set('email', null);
		factory.userData = {};
		$rootScope.signedIn = false;

		$rootScope.navigate('');
	};

	return factory;
});
