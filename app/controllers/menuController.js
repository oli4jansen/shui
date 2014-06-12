app.controller("menuController", function($scope, $rootScope, userFactory, notificationFactory, projectMenuFactory){

	$scope.init = function() {
		notificationFactory.updateNotificationCount();
	};

	$scope.showProjectMenu = false;

	projectMenuFactory.subscribe('projectMenuPopulate', function(event, items) {
		$scope.showProjectMenu = true;
		$scope.projectMenu = { items: [] };
        $scope.projectMenu.items = items;
    });

	projectMenuFactory.subscribe('projectMenuClear', function(event, data) {
		$scope.showProjectMenu = false;
		$scope.projectMenu = {};
    });

    projectMenuFactory.subscribe('showTab', function(event, tab) {
        $scope.currentTab = tab;
    });

    $scope.projectMenuShowTab = function(tab) {
    	projectMenuFactory.publish('showTab', tab);
    };

});