app.controller("projectsController", function($scope, $rootScope, userFactory, projectFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Your projects.';
	$rootScope.menuState = 'projects';

	$scope.projects = [];
	$scope.predicate = '-openTasks';
	$scope.reverse = 'false';

	$scope.init = function() {
		projectFactory.getProjects(function(){

			projectFactory.projects.forEach(function(project) {

				if(project.participants.length > 3) {
					var more = project.participants.length - 2;
					var moreS = 's';
					if(more.length == 1) moreS = '';
					project.participants = project.participants[0].name + ', ' + project.participants[1].name + ' and ' + more + ' other' + moreS + '.';
				}else if(project.participants.length == 1){
					project.participants = 'Just you.'
				}else {
					project.participants = project.participants.map(function(person){ return person.name; }).join(", ")+'.';
				}

				$scope.projects.push(project);
			});

		});

		if($scope.projects.length == 0) $rootScope.pageTitle = 'You don\'t have any projects yet.';
	};

});