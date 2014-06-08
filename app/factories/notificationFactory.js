app.factory('notificationFactory', function($rootScope) {

	var factory = {};

	factory.notifications = [];

	factory.getNotifications = function(callback) {
		/*
		Call API

		To do: beveiliging verzinnen
		*/

		factory.notifications = [{
				project: {
					id: 1,
					name: 'Autonome Systemen met Kunstmatige Intelligentie'
				},
				author: {
					id: 2,
					name: 'Ari Saadon'
				},
				id: 1,
				type: 'picture',
				unread: true
			}, {
				project: {
					id: 2,
					name: 'Biologie PO'
				},
				author: {
					id: 2,
					name: 'Kevin Doan'
				},
				id: 2,
				type: 'message',
				unread: false
			}, {
				project: {
					id: 2,
					name: 'Biologie PO'
				},
				author: {
					id: 2,
					name: 'Andi Baaij'
				},
				id: 3,
				type: 'location',
				unread: false
			}, {
				project: {
					id: 1,
					name: 'Scriptie Deterministic Finite State Machines'
				},
				author: {
					id: 2,
					name: 'Ruben Steendam'
				},
				id: 4,
				type: 'invite',
				unread: false
			}];

		callback();
	};

	factory.updateNotificationCount = function() {

		var result = {
			status: 200,
			data: {
				count: 1
			}
		};

		if(result.status == 200) {
			$rootScope.notificationCount = result.data.count;
		}else{
			$rootScope.notificationCount = 0;
			console.log('Error: can\'t get notification count.');
		}
	};

	return factory;
});
