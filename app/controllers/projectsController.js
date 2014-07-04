app.controller("projectsController", function($scope, $rootScope, $sce, $timeout, userFactory, projectFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Your projects';
	$rootScope.menuState = 'projects';

	$scope.projects = [];
	$scope.predicate = '-openTasks';
	$scope.reverse = 'false';

	$scope.init = function() {
		$scope.loading = true;
		if($rootScope.signedIn) {
			console.log('Yes auth');
			projectFactory.getProjects(function(){

				$scope.projects = [];

				projectFactory.projects.forEach(function(project) {

					console.log(project.participants);

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
				if($scope.projects.length == 0) $rootScope.pageTitle = 'You don\'t have any projects yet.';
				$scope.loading = false;
			});
		}else{
			$scope.loading = true;
			$timeout(function() {
				$scope.init();
			}, 250);
		}
	};

	$scope.edit = function (project) {
		$rootScope.popup = {
			title: 'Change project name',
			head: {
				cancel: 'Cancel',
				action: 'Change name',
				callbackData: true,
				callback: function(data) {
					console.log(data);

				}
			},
			content: $sce.trustAsHtml('<div class="padding">'+
				'<input type="text" value="'+project.name+'">'+
				'</div>')
		};
	};

	$rootScope.$on('projectsListRefresh', function() {
		$scope.init();
	});

});