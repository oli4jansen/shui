app.controller("menuController", function($scope, $rootScope, $timeout, userFactory, notificationFactory, projectMenuFactory){

	$scope.init = function() {
		$timeout(function () {
			if($rootScope.signedIn) notificationFactory.updateNotificationCount();
			$scope.init();
		}, 60*1000);
	};

	$rootScope.showProjectMenu = false;

	projectMenuFactory.subscribe('projectMenuPopulate', function(event, items) {
		$rootScope.showProjectMenu = true;
		$scope.projectMenu = { items: [] };
        $scope.projectMenu.items = items;
    });

	projectMenuFactory.subscribe('projectMenuClear', function(event, data) {
		$rootScope.showProjectMenu = false;
		$scope.projectMenu = {};
    });

    projectMenuFactory.subscribe('unifyShowTab', function(event, tab) {
        $scope.currentTab = tab;
    });

    $scope.projectMenuShowTab = function(tab) {
    	projectMenuFactory.publish('unifyShowTab', tab);
    };

    $scope.$on("$destroy", function() {
		$rootScope.pageSubTitle = false;
		$rootScope.backButton = false;
		$timeout.cancel();
		projectMenuFactory.publish('projectMenuClear', {});
	});

});