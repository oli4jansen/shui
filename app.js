var app = angular.module('Shui', ['ngRoute', 'ngAnimate', 'LocalStorageModule', 'ngTagsInput']).config(function($routeProvider) {

	$routeProvider.when('/', {
		templateUrl: 'app/views/home.html',
		controller:  'homeController'

	}).when('/signin', {
		templateUrl: 'app/views/signin.html',
		controller:  'signInController'
	}).when('/signin/:action', {
		templateUrl: 'app/views/signin.html',
		controller:  'signInController'

	}).when('/notifications', {
		templateUrl: 'app/views/notifications.html',
		controller:  'notificationsController'

	}).when('/projects/:id/:name', {
		templateUrl: 'app/views/project.html',
		controller:  'projectController'
	}).when('/projects/:id/:name/:view', {
		templateUrl: 'app/views/project.html',
		controller:  'projectController'
	}).when('/projects/new', {
		templateUrl: 'app/views/new.html',
		controller:  'newProjectController'
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
	$rootScope.protectedPages = ['/notifications', '/projects', '/projects/new', '/projects/:id/:name', '/settings'];

	$rootScope.$on( "$routeChangeStart", function(event, next, current) {

		if($location.path() == '/') {
			$rootScope.paddingTop100 = true;
		}else{
			$rootScope.paddingTop100 = false;
		}

		if($rootScope.protectedPages.indexOf(next.$$route.originalPath) > -1 && $rootScope.signedIn !== true) {

			var oldPath = $location.path();

			$location.path('/signin').search('redirect', oldPath);
		}

    });

	$rootScope.navigate = function(path) {
		$location.path('/'+path);
	};

}).filter('fileSelection', function() {
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
    if(selection == 'all') {
    	return input;
    }else if(selection == 'mine'){
    	var filtered = [];
    	input.forEach(function(item) {
    		if(item.assignedTo.id == userFactory.userData.id) {
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

angular.bootstrap(document.getElementById("document"), ['Shui']);