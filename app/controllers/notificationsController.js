app.controller("notificationsController", function($scope, $rootScope, userFactory, notificationFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Notifications.';
	$rootScope.menuState = 'notifications';

	$scope.notifications = [];

	$scope.init = function() {
		notificationFactory.getNotifications(function(){

			var notificationsToUpdate = [];

			notificationFactory.notifications.forEach(function(notification) {

				switch(notification.type) {
					case 'picture':
						notification.icon = 'ion-ios7-camera-outline';
						notification.description = notification.author.name + ' added a picture.';
						break;
					case 'document':
						notification.icon = 'ion-ios7-copy-outline';
						notification.description = notification.author.name + ' added a document.';
						break;
					case 'message':
						notification.icon = 'ion-ios7-compose-outline';
						notification.description = notification.author.name + ' wrote a message.';
						break;
					case 'invite':
						notification.icon = 'ion-ios7-personadd-outline';
						notification.description = notification.author.name + ' invited you.';
						break;
					case 'location':
						notification.icon = 'ion-ios7-location-outline';
						notification.description = notification.author.name + ' added a location.';
						break;
					default:
						notification.icon = 'ion-ios7-lightbulb-outline';
						notification.description = notification.author.name + ' did something.';
						break;
				}

				if(notification.unread) {
					$rootScope.notificationCount--;
					notificationsToUpdate.push(notification.id);
				}

				$scope.notifications.push(notification);
			});

			/*
				Todo: update notifications (in notificationsToUpdate) from unread to read
			*/

		});
	};

});