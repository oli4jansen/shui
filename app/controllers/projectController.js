app.controller("projectController", function($scope, $rootScope, $timeout, $routeParams, $sce, userFactory, projectFactory, fileFactory, projectMenuFactory, localStorageService){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Loading project..';

	$rootScope.menuState = 'projects';

	$scope.project = {};
	$scope.userData = userFactory.userData;
	$scope.currentTab = '';

	$scope.init = function() {

		$rootScope.loading = true;
		$rootScope.pageTitle = $routeParams.name;

		if($rootScope.signedIn) {

			projectFactory.getProject($routeParams.id, function(project){
				if(!project) $rootScope.navigate('projects');

				$scope.project = project;
				$scope.project.participants.forEach(function (participant) {
					var joined = new Date(participant.joined);
					participant.joined = joined.getFullYear()+'-'+(joined.getMonth()+1)+'-'+joined.getDate();
				});
				$rootScope.pageTitle = project.name;

				$scope.redrawMenu();

				if($scope.project.deadline) {
					$scope.calculateTimeLeft();

					if(project.deadlineValid) {
						if(!project.deadlinePassed) {
							if(project.daysLeft < 3) {
								$rootScope.pageSubTitle = 'Deadline in '+project.hoursLeft+' hours and '+project.hoursMinutesLeft+' minutes';
							}else{
								$rootScope.pageSubTitle = 'Deadline in '+project.daysLeft+' day';
								if(project.daysLeft > 1) $rootScope.pageSubTitle = $rootScope.pageSubTitle + 's'
							}
						}else{
							$rootScope.pageSubTitle = 'Deadline has passed.';
						}
					}
				}

				$rootScope.loading = false;

				$timeout(function () {
					if($routeParams.view !== undefined) {
						projectMenuFactory.publish('showTab', $routeParams.view);
					}else{
						projectMenuFactory.publish('showTab', 'files');
					}
				}, 10);

			});
		}else{
			$rootScope.loading = false;
		}
	};

	$scope.redrawMenu = function() {
		var menuItems = [{
				icon: 'ion-ios7-people-outline',
				name: 'participants'
			}, {
				icon: 'ion-ios7-chatboxes-outline',
				name: 'messages'
			}, {
				icon: 'ion-ios7-briefcase-outline',
				count: $scope.project.myTasks,
				color: 'gray',
				name: 'tasks'
			}, {
				icon: 'ion-ios7-copy-outline',
				name: 'files'
		}];
		projectMenuFactory.publish('projectMenuPopulate', menuItems);
	};

	$scope.calculateTimeLeft = function() {
		var created = new Date($scope.project.created);
		var deadline = new Date($scope.project.deadline);
		var today = new Date();

		$scope.project.daysElapsed = (created.getTime() - today.getTime())/(24*60*60*1000);
		$scope.project.deadlineValid = ( (deadline.getTime() - created.getTime()) / (24*60*60*1000) < 0 || deadline.getTime() == created.getTime()) ? false : true;

		if($scope.project.deadlineValid) {
			if(today.getTime() - deadline.getTime() > 0) {
				$scope.project.deadlinePassed = true;
			}else{
				$scope.project.deadlinePassed = false;
			}

			$scope.project.daysLeft = Math.round(Math.abs((today.getTime() - deadline.getTime())/(24*60*60*1000)));
			$scope.project.hoursLeft = Math.round(Math.abs((today.getTime() - deadline.getTime())/(60*60*1000)));
			$scope.project.hoursMinutesLeft = Math.round(Math.abs((today.getTime() - deadline.getTime())/(60*1000))) - Math.floor(Math.abs((today.getTime() - deadline.getTime())/(60*60*1000)))*60;

			$scope.project.percentageTime = $scope.project.daysElapsed / ($scope.project.daysElapsed + $scope.project.daysLeft) * 100;
		}
	};

	// De templates bevinden zich binnen project.html
	$scope.tabs = {
		participants: 'project-participants.html',
		messages: 'project-messages.html',
		tasks: 'project-tasks.html',
		files: 'project-files.html'
	};

	$scope.showTab = function(tab) {
		projectMenuFactory.publish('showTab', tab);
	};

	projectMenuFactory.subscribe('showTab', function(event, tab) {
		if($scope.tabs[tab]) {
			$scope.currentTab = $scope.tabs[tab];

			switch(tab) {
				case 'tasks':
					$scope.selection = 'mine';
					$scope.loading = true;
					$rootScope.pageSubTitle = 'Tasks';

					projectFactory.getTasks($routeParams.id, function(tasks){
						$scope.loading = false;
						tasks.forEach(function (task) {
							if($scope.project.participants !== undefined) {
								$scope.project.participants.forEach(function (participant) {
									if(task.assignedTo == participant.email) task.assignedTo = participant;
									if(task.assignedBy == participant.email) task.assignedBy = participant;
								});
							}
						});

						$scope.tasks = tasks.sort(function(a ,b){
							if(a.finished && !b.finished) return 1;
							if(b.finished && !a.finished) return -1;
							return 0;
						});
					});
					break;

				case 'messages':
					$scope.loading = true;
					$rootScope.pageSubTitle = 'Messages';
					$scope.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
					var today = new Date();
					$scope.currentDay = today.getDate();
					$scope.currentMonth = $scope.monthNames[today.getMonth()];

					$scope.messages = [];

					projectFactory.getMessages($routeParams.id, function(messages){
						$scope.loading = false;
						messages.forEach(function(message) {

							var created = new Date(message.created);
							message.day = created.getDate();
							message.month = $scope.monthNames[created.getMonth()];

							message.author = { name: message.author };

							if($scope.project.participants !== undefined) {
								$scope.project.participants.forEach(function (participant) {
									if(message.author.name == participant.email) message.author = participant;
								});
							}

							$scope.messages.push(message);
						});
					});
					break;

				case 'files':
					$scope.loading = true;
					$rootScope.pageSubTitle = 'Files';
					$scope.files = [];
					$scope.selection = 'all';

					if($routeParams.id) {
						projectFactory.getFiles($routeParams.id, function(files){
							$scope.loading = false;
							files.forEach(function(file) {
								file = $scope.parseFile(file);

								if($scope.project.participants !== undefined) {
									$scope.project.participants.forEach(function (participant) {
										if(file.author == participant.email) file.author = participant;
									});
								}
								$scope.files.push(file);
							});
							
							$scope.files.sort(function(a, b) {
								if (b.id < a.id) return -1;
								if (b.id > a.id) return 1;
								return 0;
							});
						});
					}
					break;
				case 'participants':
					$rootScope.pageSubTitle = 'Participants';
					break;
			}

		}
	});

	$scope.finishTask = function(task) {
		$rootScope.popup = {
			title: task.name,
			head: {
				cancel: 'Cancel',
				action: 'Finish task',
				callbackData: true,
				callback: function(data) {
					console.log(data);
					if(data.evaluation !== undefined && data.hours !== undefined) {
						$rootScope.popup = false;

						projectFactory.finishTask($scope.project.id, task.id, data.evaluation, data.hours, function (err) {
							if(!err) {
								var index = $scope.tasks.indexOf(task);
								$scope.tasks[index].finished = true;
								$scope.tasks[index].hours = parseFloat(data.hours.replace(',', '.'));

								if(task.assignedTo.email == userFactory.userData.email) {
									$scope.project.myTasks--;
									$scope.redrawMenu();
								}

							}else{
								alert('Something went wrong.');
							}
						});
					}else{
						alert('Something went terribly wrong. We\'re sorry.');
					}
				}
			},
			content: $sce.trustAsHtml('<div class="padding">'+
				'<textarea rows="2" placeholder="Write something about finishing this task." name="evaluation"></textarea>'+
				'<label class="label-input">This task took <input type="number" value="1" name="hours"> hours to complete.</label>'+
				'</div>')
		};
	};

	$scope.deleteParticipant = function (participant) {
		var participantName = participant.name+' ('+participant.email+')';
		if(participant.email == $scope.userData.email) participantName = 'yourself';

		$rootScope.popup = {
			title: 'Remove participant',
			head: {
				cancel: 'Cancel',
				action: 'Remove',
				callbackData: true,
				callback: function(data) {
					$rootScope.popup = false;
					projectFactory.deleteParticipant($scope.project.id, participant.email, function(error) {
						if(!error){
							if(participant.email == $scope.userData.email) {
								$rootScope.navigate('projects');
							}else{
								var index = $scope.project.participants.indexOf(participant);
								$scope.project.participants.splice(index, 1);								
							}
						}else{
							alert('Something went wrong deleting this participant. Please reload the page and try again.');
						}
					});
				}
			},
			content: $sce.trustAsHtml('<div class="padding">'+
				'<p>Are you sure you want to remove '+participantName+' from the project?</p>'+
				'</div>')
		};
	};

	$scope.deleteTask = function (task) {
		projectFactory.deleteTask($scope.project.id, task.id, function(error) {
			if(!error){
				var index = $scope.tasks.indexOf(task);
				$scope.tasks.splice(index, 1);
				if(!task.finished && task.assignedTo.email == userFactory.userData.email) {
					$scope.project.myTasks--;
					$scope.redrawMenu();
				}
			}else{
				alert('Something went wrong deleting your task. Please reload the page and try again.');
			}
		});
	};

	$scope.deleteMessage = function (message) {
		projectFactory.deleteMessage($scope.project.id, message.id, function(error) {
			if(!error){
				var index = $scope.messages.indexOf(message);
				$scope.messages.splice(index, 1);
			}else{
				alert('Something went wrong deleting your message. Please reload the page and try again.');
			}
		});
	};

	$scope.deleteFile = function(file) {
		projectFactory.deleteFile($scope.project.id, file.id, function(error) {
			if(!error){
				var index = $scope.files.indexOf(file);
				$scope.files.splice(index, 1);
			}else{
				alert('Something went wrong deleting your file. Please reload the page and try again.');
			}
		});
	};

	$scope.showComments = function() {
		$rootScope.popup = {
			title: 'Comments',
			head: {
				cancel: 'Close'
			},
			content: $sce.trustAsHtml('<div class="padding center">'+
				'<p>This feature is not available yet. We\'re sorry.</p>'+
				'</div>')
		};
	};

	$scope.addParticipant = function() {
		$rootScope.popup = {
			head: {
				cancel: 'Cancel',
				action: 'Invite',
				callbackData: true,
				callback: function(data) {
					projectFactory.invite($scope.project.id, data.email, function(error, data){
						if(!error && data) {
							$rootScope.popup = false;
							$scope.project.participants.push(data);
						}else{
							alert(error);
						}
					});
				}
			},
			content: $sce.trustAsHtml('<div class="padding">'+
				'<input type="text" placeholder="Participants email adress." name="email">'+
			'</div>')
		};
	};

	$scope.addTask = function() {
		var content = '<div class="padding">'+
						'<div class="item task">'+
							'<div class="icon-holder">'+
								'<div class="icon gray hollow">'+
									'<strong>0</strong>hours'+
								'</div>'+
							'</div>'+
							'<div class="body">'+
						  		'<input type="text" class="small" placeholder="Name of the task" name="name">'+
								'<select name="assignTo" class="small borderless">'+
									'<option>Choose participant to assign to:</option>';

		$scope.project.participants.forEach(function(person){
			content = content + '<option value="'+person.email+'">'+person.name+' - '+person.email+'</option>';
		});

		content = content + 	'</select>'+
						    	'<textarea placeholder="Write a description." class="medium" rows="2" name="description"></textarea>'+
							'</div></div>';

		$rootScope.popup = {
			head: {
				cancel: 'Cancel',
				action: 'Add task',
				callbackData: true,
				callback: function(data) {
					projectFactory.postNewTask($scope.project.id, data.name, data.description, data.assignTo, function(error, task) {
						if(!error){
							$rootScope.popup = false;
							$scope.project.participants.forEach(function (participant) {
								if(task.assignedTo == participant.email) {
									task.assignedTo = participant;
								}
								if(task.assignedBy == participant.email) task.assignedBy = participant;
							});
							if(task.assignedTo == $scope.userData.email) {
								$scope.project.myTasks++;
								$scope.redrawMenu();
							}

							$scope.tasks.unshift(task);
							$scope.selection = 'all';
						}else{
							alert('Something went wrong posting your task. Please reload the page and try again.');
						}
					});
				}
			},
			content: $sce.trustAsHtml(content)
		};
	};

	$scope.addMessage = function() {
		$rootScope.popup = {
			head: {
				cancel: 'Cancel',
				action: 'Post message',
				callbackData: true,
				callback: function(data) {
					projectFactory.postNewMessage($scope.project.id, data.body, function(error, message) {
						if(!error){

							$rootScope.popup = false;

							var created = new Date(message.created);
							message.day = created.getDate();
							message.month = $scope.monthNames[created.getMonth()];
				
							$scope.project.participants.forEach(function (participant) {
								if(message.author == participant.email) message.author = participant;
							});

							$scope.messages.unshift(message);
						}else{
							alert('Something went wrong posting your message. Please reload the page and try again.');
						}
					});
				}
			},
			content: $sce.trustAsHtml('<div class="padding">'+
				'<div class="item message">'+
					'<div class="icon-holder">'+
						'<div class="icon red hollow empty">'+
							'<strong>'+$scope.currentDay+'</strong>'+
							$scope.currentMonth+
						'</div>'+
					'</div>'+

					'<div class="body">'+
				  		'<strong>'+$scope.userData.name+'</strong> '+$scope.userData.email+
				    	'<textarea placeholder="Write a message." class="medium margin" rows="4" name="body"></textarea>'+
					'</div>'+
				'</div>'+
			'</div>')
		};
	};

	$scope.addItem = function() {
		$rootScope.popup = {
			head: {
				cancel: 'Cancel',
				action: 'Add item',
				left: 'How do I get a file\'s URL?',
				leftPath: '/#/help/files#new',
				callbackData: true,
				callback: function(data) {
					projectFactory.postNewItem($scope.project.id, data.name, data.url, data.description, function(error, file) {
						if(!error){

							$rootScope.popup = false;
							
							$scope.project.participants.forEach(function (participant) {
								if(file.author == participant.email) file.author = participant;
							});
							$scope.files.unshift($scope.parseFile(file));
						}else{
							alert('Something went wrong posting your message. Please reload the page and try again.');
						}
					});
				}
			},
			content: $sce.trustAsHtml('<div class="padding"><div class="item">'+
				'<div class="icon-holder">'+
					'<div class="icon logo empty"></div>'+
				'</div>'+
				'<div class="body">'+
			  		'<input type="text" class="medium" placeholder="New File Name" name="name">'+
			  		'<input type="text" class="small" placeholder="URL to file/picture/video/location" name="url">'+
			    	'<textarea placeholder="Write a description." class="medium" rows="4" name="description"></textarea>'+
				'</div>'+
			'</div>')
		};
	};

	$scope.parseFile = function(file) {
		fileFactory.setURL(file.url);

		file.type = fileFactory.fileType;
		file.provider = fileFactory.provider;
		file.showableUrl = fileFactory.showableUrl;

		return file;
	};

	$scope.$on("$destroy", function() {
		$rootScope.pageSubTitle = false;
		$rootScope.backButton = false;
		$timeout.cancel();
		projectMenuFactory.publish('projectMenuClear', {});
	});

});