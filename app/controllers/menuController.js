app.controller("menuController", function($scope, $rootScope, $timeout, userFactory, notificationFactory, projectMenuFactory){

	$scope.init = function() {
		$timeout(function () {
			console.log('Updating notification count');
			notificationFactory.updateNotificationCount();
			$scope.init();
		}, 5*60*1000);
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

    	$scope.$on("$destroy", function() {
		$rootScope.pageSubTitle = false;
		$rootScope.backButton = false;
		$timeout.cancel();
		projectMenuFactory.publish('projectMenuClear', {});
	});

});