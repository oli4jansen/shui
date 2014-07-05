app.controller("notificationsController", function($scope, $rootScope, userFactory, notificationFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Notifications';
	$rootScope.menuState = 'notifications';

	$scope.notifications = [];
	$scope.readNotifications = false;

	$scope.init = function() {
		notificationFactory.getNotifications(function(){

			console.log('Notifications [RAW]:');
			console.log(notificationFactory.notifications);

			notificationFactory.notifications.forEach(function(notification) {

				switch(notification.type) {
					case 'picture':
						notification.icon = 'ion-ios7-camera-outline';
						notification.description = notification.sender_name + ' added a picture.';
						notification.tab = 'files';
						break;
					case 'document':
					case 'file':
						notification.icon = 'ion-document';
						notification.description = notification.sender_name + ' added a file.';
						notification.color = 'blue';
						notification.tab = 'files';
						break;
					case 'message':
						notification.icon = 'ion-chatbubble';
						notification.description = notification.sender_name + ' wrote a message.';
						notification.tab = 'messages';
						break;
					case 'invite':
						notification.icon = 'ion-person-add';
						notification.description = notification.sender_name + ' invited you.';
						notification.tab = 'participants';
						notification.color = 'green';
						break;
					case 'uninvite':
						notification.icon = 'ion-close-circled';
						notification.description = notification.sender_name + ' removed you.';
						notification.color = 'red';
						break;
					case 'location':
						notification.icon = 'ion-location';
						notification.description = notification.sender_name + ' added a location.';
						notification.tab = 'files';
						break;
					case 'task_assigned':
						notification.icon = 'ion-briefcase';
						notification.description = notification.sender_name + ' assigned you a task.';
						notification.tab = 'tasks';
						notification.color = 'pink';
						break;
					default:
						notification.icon = 'ion-lightbulb';
						notification.description = notification.sender_name + ' did something.';
						notification.tab = '';
						break;
				}

				if(notification.unread) {
					$scope.readNotifications = true;
					$rootScope.notificationCount--;
					
					if($rootScope.notificationCount > 0) {
						document.title = '('+$rootScope.notificationCount+') Unify';
					}else{
						document.title = 'Unify';
					}
				}

				$scope.notifications.push(notification);

//				$scope.notifications.push(notification);
			});

			console.log('Yo');
			console.log($scope.notifications);

			if($scope.readNotifications) notificationFactory.readNotifications();

		});
	};

});