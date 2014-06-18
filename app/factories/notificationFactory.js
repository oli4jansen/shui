app.factory('notificationFactory', function($http, $rootScope, userFactory) {

	var factory = {};

	factory.notifications = [];
	factory.API = 'http://0.0.0.0:3000';

	factory.getNotifications = function(callback) {
		
		$http({
			method: 'GET',
			url: factory.API+'/me/notifications'
		}).success(function(data, status, header, config) {

			factory.notifications = data.sort(function(a ,b){
				if(a.id < b.id) return 1;
				if(b.id < a.id) return -1;
				return 0;
			});

			callback();

		}).error(function(data, status, headers, config){
			// THIS HAS TO BE HANDLED
			alert(status);
			alert(data);
			console.log(data);

			callback();
		});
	};

	factory.getNotificationCount = function(callback) {
		
		$http({
			method: 'GET',
			url: factory.API+'/me/notifications/count'
		}).success(function(data, status, header, config) {
			console.log(data);

			callback(data.count);
		}).error(function(data, status, headers, config){
			console.log(data);
			callback(0);
		});

	};

	factory.updateNotificationCount = function() {
		factory.getNotificationCount(function(count) {
			$rootScope.notificationCount = count;
		});
	};

	factory.readNotifications = function() {
		$http({
			method: 'POST',
			url: factory.API+'/me/notifications'
		}).error(function(data, status, headers, config){
			alert(data);
			console.log(data);
		});
	};

	return factory;
});
