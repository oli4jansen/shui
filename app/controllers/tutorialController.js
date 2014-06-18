app.controller("tutorialController", function($scope, $sce, $rootScope, localStorageService, userFactory, projectMenuFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = false;
	$rootScope.menuState = false;

	$scope.slide = 0;

	$scope.init = function() {
		if(userFactory.userData.name == '') {
			$rootScope.popup = {
				head: {
					action: 'Save',
					callbackData: true,
					callback: function(data) {
						$rootScope.popup = false;
						userFactory.update(data.name, function(error){
							if(error) alert('Something went wrong while we were saving your name.');
						});
					}
				},
				content: $sce.trustAsHtml('<div class="padding">'+
					'<input type="text" name="name" placeholder="What is your name?">'+
				'</div>')
			};
		}
	};

	$scope.nextSlide = function() {
		$scope.slide++;
		$scope.tabChanged();
	};

	$scope.previousSlide = function() {
		$scope.slide--;
		$scope.tabChanged();
	};

	$scope.tabChanged = function() {
		switch($scope.slide) {
			case 0:
				$rootScope.menuState = false;
				break;
			case 1:
				$rootScope.menuState = 'signin';
				break;
			case 2:
				$rootScope.paddingTop100 = false;
				break;
			case 3:
				$rootScope.paddingTop100 = true;
				projectMenuFactory.publish('projectMenuPopulate', [{
					icon: 'ion-ios7-people-outline',
					name: 'participants'
				}, {
					icon: 'ion-ios7-chatboxes-outline',
					name: 'messages'
				}, {
					icon: 'ion-ios7-briefcase-outline',
					name: 'tasks'
				}, {
					icon: 'ion-ios7-copy-outline',
					name: 'files'
				}]);
				break;
			case 4:
				$rootScope.paddingTop100 = false;
				break;
		}
	};

});