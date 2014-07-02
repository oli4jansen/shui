app.factory('projectFactory', function($http, $rootScope, userFactory, fileFactory) {

	var factory = {};

	factory.projects = [];

	factory.API = 'http://oli4jansen.nl:81';

	factory.createProject = function(name, participantsIn, callback) {

		var participantsOut = [];

		participantsIn.forEach(function (item) { participantsOut.push({ email: item.text }) });

		$http({
			method: 'POST',
			url: factory.API+'/projects',
			data: {
				name: name,
				participants: participantsOut
			}
		}).success(function(data, status, headers, config){
			callback(false, data);
		}).error(function(data, status, headers, config){
			callback(data.msg, {});
		});

	};

	factory.getProjects = function(callback) {

		$http({
			method: 'GET',
			url: factory.API+'/projects'
		}).success(function(data, status, headers, config){
			factory.projects = data;
			console.log(data);
			callback();
		}).error(function(data, status, headers, config){
			factory.projects = [];
			alert('Something went wrong while getting your projects.');
			callback();
		});

	};

	factory.getProject = function(id, callback) {
		
		$http({
			method: 'GET',
			url: factory.API+'/projects/'+id
		}).success(function(data, status, headers, config){
			callback(data);
		}).error(function(data, status, headers, config){
			callback(false);
		});

	};

	factory.getTasks = function(projectId, callback) {

		$http({
			method: 'GET',
			url: factory.API+'/projects/'+projectId+'/tasks'
		}).success(function(data, status, headers, config){
			callback(data);
		}).error(function(data, status, headers, config){
			alert('Something went wrong while getting this project.');
			callback([]);
		});

	};

	factory.getMessages = function(projectId, callback) {

		$http({
			method: 'GET',
			url: factory.API+'/projects/'+projectId+'/messages'
		}).success(function(data, status, headers, config){
			callback(data);
		}).error(function(data, status, headers, config){
			alert('Something went wrong while getting this project\'s messages.');
			callback([]);
		});

	};

	factory.getFiles = function(projectId, callback) {

		$http({
			method: 'GET',
			url: factory.API+'/projects/'+projectId+'/files'
		}).success(function(data, status, headers, config){
			callback(data);
		}).error(function(data, status, headers, config){
			callback([]);
		});

	};

	factory.postNewTask = function(projectId, name, description, assignedTo, callback) {

		$http({
			method: 'POST',
			url: factory.API+'/projects/'+projectId+'/tasks',
			data: {
				name: name,
				description: description,
				assignedTo: assignedTo
			}
		}).success(function(data, status, headers, config){
			console.log(data);
			callback(false, data);
		}).error(function(data, status, headers, config){
			alert('Something went wrong while creating the task.');
			callback(true, {});
		});

	};

	factory.postNewMessage = function(projectId, body, callback) {

		$http({
			method: 'POST',
			url: factory.API+'/projects/'+projectId+'/messages',
			data: {
				body: body
			}
		}).success(function(data, status, headers, config){
			console.log(data);
			callback(false, data);
		}).error(function(data, status, headers, config){
			alert('Something went wrong while creating the task.');
			callback(true, {});
		});

	};

	factory.postNewItem = function(projectId, name, url, description, callback) {

		$http({
			method: 'POST',
			url: factory.API+'/projects/'+projectId+'/files',
			data: {
				name: name,
				description: description,
				url: url
			}
		}).success(function(data, status, headers, config){
			console.log(data);
			callback(false, data);
		}).error(function(data, status, headers, config){
			alert('Something went wrong while creating the task.');
			callback(true, {});
		});

	};

	factory.deleteParticipant = function(projectId, participantId, callback) {

		$http({
			method: 'DELETE',
			url: factory.API+'/projects/'+projectId+'/participants/'+participantId
		}).success(function(data, status, headers, config){
			callback(false);
		}).error(function(data, status, headers, config){
			alert('Something went wrong while deleting the participant.');
			callback(true);
		});

	};

	factory.deleteTask = function(projectId, taskId, callback) {

		$http({
			method: 'DELETE',
			url: factory.API+'/projects/'+projectId+'/tasks/'+taskId
		}).success(function(data, status, headers, config){
			callback(false);
		}).error(function(data, status, headers, config){
			alert('Something went wrong while deleting the task.');
			callback(true);
		});

	};

	factory.deleteMessage = function(projectId, messageId, callback) {

		$http({
			method: 'DELETE',
			url: factory.API+'/projects/'+projectId+'/messages/'+messageId
		}).success(function(data, status, headers, config){
			callback(false);
		}).error(function(data, status, headers, config){
			alert('Something went wrong while deleting the message.');
			callback(true);
		});

	};

	factory.deleteFile = function(projectId, fileId, callback) {

		$http({
			method: 'DELETE',
			url: factory.API+'/projects/'+projectId+'/files/'+fileId
		}).success(function(data, status, headers, config){
			callback(false);
		}).error(function(data, status, headers, config){
			alert('Something went wrong while deleting the file.');
			callback(true);
		});

	};

	factory.finishTask = function(projectId, taskId, evaluation, hours, callback) {

		$http({
			method: 'POST',
			url: factory.API+'/projects/'+projectId+'/tasks/'+taskId,
			data: {
				evaluation: evaluation,
				hours: hours
			}
		}).success(function(data, status, headers, config){
			callback(false);
		}).error(function(data, status, headers, config){
			alert('Something went wrong while finishing the task.');
			callback(true);
		});

	};

	factory.invite = function(projectId, email, callback) {

		$http({
			method: 'PUT',
			url: factory.API+'/projects/'+projectId+'/participants',
			data: {
				email: email
			}
		}).success(function(data, status, headers, config){
			callback(false, data);
		}).error(function(data, status, headers, config){
			callback(data.msg, false);
		});

	};

	return factory;
});
