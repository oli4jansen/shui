app.controller("projectController", function($scope, $rootScope, $timeout, $routeParams, $sce, userFactory, projectFactory, fileFactory){

	// Titel van deze pagina
	$rootScope.pageTitle = 'Loading project..';
	$rootScope.menuState = 'projects';

	$scope.project = {};
	$scope.userData = userFactory.userData;
	$scope.currentTab = '';

	$scope.init = function() {
		$rootScope.pageTitle = $routeParams.name;

		projectFactory.getProject($routeParams.id, function(project){
			$scope.project = project;
			$rootScope.pageTitle = project.name;

			$scope.showTab('files');

			if($scope.project.deadline) {
				$scope.calculateTimeLeft();

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
		});

		if($routeParams.view) {
			$scope.showTab($routeParams.view);
		}
	};

	$scope.calculateTimeLeft = function() {
		var created = new Date($scope.project.created);
		var deadline = new Date($scope.project.deadline);
		var today = new Date();

		if(today.getTime() - deadline.getTime() > 0) {
			$scope.project.deadlinePassed = true;
		}else{
			$scope.project.deadlinePassed = false;
		}

		$scope.project.daysLeft = Math.round(Math.abs((today.getTime() - deadline.getTime())/(24*60*60*1000)));
		$scope.project.hoursLeft = Math.round(Math.abs((today.getTime() - deadline.getTime())/(60*60*1000)));
		$scope.project.hoursMinutesLeft = Math.round(Math.abs((today.getTime() - deadline.getTime())/(60*1000))) - Math.floor(Math.abs((today.getTime() - deadline.getTime())/(60*60*1000)))*60;

		$scope.project.daysElapsed = Math.round(Math.abs((created.getTime() - today.getTime())/(24*60*60*1000)));

		$scope.project.percentageTime = $scope.project.daysElapsed / ($scope.project.daysElapsed + $scope.project.daysLeft) * 100;
	};

	// De templates bevinden zich binnen project.html
	$scope.tabs = {
		participants: 'project-participants.html',
		messages: 'project-messages.html',
		tasks: 'project-tasks.html',
		files: 'project-files.html'
	};

	// In deze functie bevind zich ook enige logica voor specifieke tabs
	$scope.showTab = function(tab) {
		if($scope.tabs[tab]) {
			$scope.currentTab = $scope.tabs[tab];

			switch(tab) {
				case 'tasks':
					$scope.selection = 'mine';

					projectFactory.getTasks($scope.project.id, function(tasks){
						$scope.tasks = tasks.sort(function(a ,b){
							if(a.finished && !b.finished) return 1;
							if(b.finished && !a.finished) return -1;
							return 0;
						});
					});
					break;

				case 'messages':
					$scope.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
					var today = new Date();
					$scope.currentDay = today.getDate();
					$scope.currentMonth = $scope.monthNames[today.getMonth()];

					$scope.messages = [];

					projectFactory.getMessages($scope.project.id, function(messages){
						messages.forEach(function(message) {

							var created = new Date(message.created);
							message.day = created.getDate();
							message.month = $scope.monthNames[created.getMonth()];

							$scope.messages.push(message);
						});
					});
					break;

				case 'files':
					$scope.files = [];
					$scope.selection = 'all';

					projectFactory.getFiles($scope.project.id, function(files){
						files.forEach(function(file) {
							file = $scope.parseFile(file);
							$scope.files.push(file);
						});
						$scope.files.sort(function(a, b) {
							if (b.id < a.id) return -1;
							if (b.id > a.id) return 1;
							return 0;
						});
					});
					break;
			}

		}
	};

    
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

						if(projectFactory.finishTask(task.id, data.evaluation, data.hours)) {
							var index = $scope.tasks.indexOf(task);
							$scope.tasks[index].finished = true;
							$scope.tasks[index].hours = data.hours;

							$scope.project.finishedTasks++;
							$scope.project.openTasks--;

							$scope.calculatePercentageTasks();
						}else{
							alert('Something went wrong.');
						}
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

	$scope.deleteMessage = function(message) {
		projectFactory.deleteMessage(message.id, function(error, data) {
			if(!error){

				console.log($scope.messages);

				var index = $scope.messages.indexOf(message);
				$scope.messages.splice(index, 1);

				console.log($scope.messages);

			}else{
				alert('Something went wrong deleting your message. Please reload the page and try again.');
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
					projectFactory.invite(data.email, function(error){
						if(!error) {
							$rootScope.popup = false;
							alert(data.email+' was successfully invited!');
						}else{
							alert('Something went terribly wrong. We\'re sorry.');
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
									'<option>Assign this task to</option>';

		$scope.project.participants.forEach(function(person){
			content = content + '<option value="'+person.id+'">'+person.name+' - '+person.email+'</option>';
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
							console.log(task);
							$scope.tasks.unshift(task);
							alert('You\'re task was posted!');
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
				callbackData: true,
				callback: function(data) {
					projectFactory.postNewItem($scope.project.id, data.name, data.url, data.description, function(error, file) {
						if(!error){

							$rootScope.popup = false;

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
			  		'<input type="text" class="small" placeholder="URL to file" name="url">'+
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

		console.log(file.showableUrl);

		return file;
	};

	$scope.$on("$destroy", function() {
		$rootScope.pageSubTitle = false;
		$timeout.cancel();
	});

});