var app = angular.module('Unify', ['ngRoute', 'ngAnimate', 'LocalStorageModule', 'ngTagsInput', 'unifyFilters']).config(function($routeProvider) {

	$routeProvider.when('/', {
		templateUrl: 'app/views/home.html',
		controller:  'homeController'

	}).when('/signin', {
		templateUrl: 'app/views/signin.html',
		controller:  'signInController'
	}).when('/signin/:action', {
		templateUrl: 'app/views/signin.html',
		controller:  'signInController'
	}).when('/resetpass/:email/:code', {
		templateUrl: 'app/views/signin.html',
		controller:  'signInController'
	}).when('/verification/:email?/:code?', {
		templateUrl: 'app/views/verification.html',
		controller:  'verificationController'

	}).when('/tutorial', {
		templateUrl: 'app/views/tutorial.html',
		controller:  'tutorialController'
	}).when('/help/:category?', {
		templateUrl: 'app/views/help.html',
		controller:  'helpController'

	}).when('/notifications', {
		templateUrl: 'app/views/notifications.html',
		controller:  'notificationsController'

	}).when('/projects/new', {
		templateUrl: 'app/views/new.html',
		controller:  'newProjectController'
	}).when('/projects/:id/:name?/:view?', {
		templateUrl: 'app/views/project.html',
		controller:  'projectController'
	}).when('/projects', {
		templateUrl: 'app/views/projects.html',
		controller:  'projectsController'

	}).when('/settings', {
		templateUrl: 'app/views/settings.html',
		controller:  'settingsController'

	}).otherwise(
	{
		redirectTo: '/'
	});

}).run( function($rootScope, $location) {

	$rootScope.protectedPages = ['/notifications', '/projects', '/projects/new', '/projects/:id/:name?/:view?', '/settings', '/tutorial'];

	$rootScope.$on( "$routeChangeStart", function(event, next, current) {

		window.scroll(0,0);

		$rootScope.$emit('projectMenuClear');

		if(next.$$route && next.$$route.originalPath && $rootScope.protectedPages.indexOf(next.$$route.originalPath) > -1 && !$rootScope.signedIn) {

			var oldPath = $location.path();
			$location.path('/signin').search('redirect', oldPath);

		}

    });

	$rootScope.navigate = function(path) {
		$location.path('/'+path);
	};

});


angular.module('unifyFilters', []).filter('fileSelection', function() {
  return function(input, selection) {
    if(selection == 'all') {
    	return input;
    }else{
    	var filtered = [];
    	input.forEach(function(item) {
    		if(item.type == selection) {
    			filtered.push(item);
    		}
    	});
    	return filtered;
    }
  };
}).filter('taskSelection', ['userFactory', function(userFactory) {
  return function(input, selection) {
	if(input == undefined) return [];

    if(selection == 'all') {
    	return input;
    }else if(selection == 'mine'){
    	var filtered = [];
    	input.forEach(function(item) {
    		if(item.assignedTo.email == userFactory.userData.email) {
    			filtered.push(item);
    		}
    	});
    	return filtered;
    }else if(selection == 'unfinished'){
    	var filtered = [];
    	input.forEach(function(item) { if(!item.finished) filtered.push(item) });
    	return filtered;
    }else if(selection == 'finished'){
    	var filtered = [];
    	input.forEach(function(item) { if(item.finished) filtered.push(item) });
    	return filtered;
    }else{
    	return input;
    }
  };
}]);

angular.bootstrap(document.getElementById("document"), ['Unify']);