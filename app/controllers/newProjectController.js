app.controller("newProjectController", function($scope, $location, $rootScope, projectFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = false;

	$scope.project = { name: '', participants: [] };

	$scope.init = function() {

	};

	$scope.create = function() {
		console.log($scope.project);
		projectFactory.createProject($scope.project.name, $scope.project.participants, function (err, data) {
			if(!err) {
				$rootScope.navigate('projects/'+data.id+'/'+data.name);
			}else{
				alert(err);
			}
		});
	};

});