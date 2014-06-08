app.factory('projectFactory', function($rootScope, userFactory, fileFactory) {

	var factory = {};

	factory.projects = [];

	factory.getProjects = function(callback) {
		/*
		Call API

		To do: beveiliging verzinnen
		*/

		factory.projects = [{
				id: 1,
				name: 'Autonome Systemen met Kunstmatige Intelligentie',
				participants: [{
					id: 2,
					name: 'Ari Saadon'
				}, {
					id: 1,
					name: 'Olivier Jansen'
				}],
				openTasks: 3,
				deadline: '2014-06-09 10:00:00',
				created: '2014-05-11 10:00:00',
				finishedTasks: 1
			}, {
				id: 2,
				name: 'Scriptie Deterministic Finite State Machines',
				participants: [{
					id: 1,
					name: 'Olivier Jansen'
				}, {
					id: 3,
					name: 'Ruben Steendam'
				}, {
					id: 4,
					name: 'Karel de Grote'
				}],
				openTasks: 1,
				finishedTasks: 2
			}, {
				id: 3,
				name: 'Biologie PO',
				participants: [{
					id: 1,
					name: 'Olivier Jansen'
				}, {
					id: 5,
					name: 'Kevin Doan'
				}, {
					id: 6,
					name: 'Sai-Lok Ly'
				}, {
					id: 7,
					name: 'Andi Baaij'
				}, {
					id: 8,
					name: 'Robert Barclay'
				}],
				deadline: '2014-06-09 10:00:00',
				created: '2014-05-11 10:00:00',
				openTasks: 2,
				finishedTasks: 0
			}];

		callback();
	};

	factory.getProject = function(id, callback) {
		/*
		Call API

		To do: beveiliging verzinnen
		*/
		
		callback({
			id: 3,
			name: 'Biologie PO',
			participants: [{
				id: 1,
				name: 'Olivier Jansen',
				email: 'oli4jansen.nl@gmail.com'
			}, {
				id: 5,
				name: 'Kevin Doan',
				email: 'me@kevindoan.nl'
			}, {
				id: 6,
				name: 'Sai-Lok Ly',
				email: 'sailokly@gmail.com'
			}, {
				id: 7,
				name: 'Andi Baaij',
				email: 'andibaaij@hotmail.com'
			}, {
				id: 8,
				name: 'Robert Barclay',
				email: 'barclaybarclay@gmail.com'
			}],
			messages: 17,
			files: 4,
			openTasks: 1,
			finishedTasks: 2,
			deadline: '2014-06-09 00:00:00',
			created: '2014-05-11 10:00:00',
			unread: 0
		});
	};

	factory.getTasks = function(projectId, callback) {
		/*
			Call API here
		*/

		var result = {
			status: 200,
			data: {
				tasks: [{
						id: '1342',
						name: 'Een location uitzoeken',
						description: 'Om het PO uit te voeren hebben we nog een geschikt locatie nodig. Die mag Andi uitzoeken.',
						assignedBy: {
							id: 1,
							name: 'Olivier Jansen'
						},
						assignedTo: {
							id: 7,
							name: 'Andi Baaij'
						},
						finished: true,
						hours: 3.5
					}, {
						id: '1342',
						name: 'Een foto maken voor de voorkant',
						description: 'We hebben nog een foto nodig voor de voorkant van het verslag. Ik ga deze maken.',
						assignedBy: {
							id: 7,
							name: 'Kevin Doan',
						},
						assignedTo: {
							id: 1,
							name: 'Olivier Jansen'
						},
						finished: false,
						hours: 0
					}, {
						id: '1342',
						name: 'Deadline opstellen',
						description: 'Belangrijk voor elk project is een deadline. Dit zorgt ervoor dat iedereen harder werkt en ook iets heeft om naar toe te werken. Dus. Doe je best Kevin.',
						assignedBy: {
							id: 1,
							name: 'Olivier Jansen'
						},
						assignedTo: {
							id: 7,
							name: 'Kevin Doan'
						},
						finished: true,
						hours: 1
					}]
			}
		};

		if(result.status == 200) {
			callback(result.data.tasks);
		}else{
			alert('Something went wrong. Please reload the page.');
			callback('');
		}
	};

	factory.getMessages = function(projectId, callback) {
		/*
			Call API here
		*/

		var result = {
			status: 200,
			data: {
				messages: [{
						id: '1343',
						created: '2014-06-02 12:00:00',
						body: 'Lorem ipsum dolor sit amet. The unshift() method adds one or more elements to the beginning of an array and returns the new length of the array.',
						author: {
							id: 1,
							name: 'Olivier Jansen',
							email: 'oli4jansen.nl@gmail.com'
						}
					}, {
						id: '1342',
						created: '2014-06-01 10:00:00',
						body: 'Hallo, ik ben Olivier Jansen. Dit is een testbericht, zogenaam geschreven op 1 juni 2014.',
						author: {
							id: 1,
							name: 'Olivier Jansen',
							email: 'oli4jansen.nl@gmail.com'
						}
					}]
			}
		};

		if(result.status == 200) {
			callback(result.data.messages);
		}else{
			alert('Something went wrong. Please reload the page.');
			callback('');
		}
	};

	factory.getFiles = function(projectId, callback) {
		/*
			Call API here
		*/

		var result = {
			status: 200,
			data: {
				files: [{
						id: 90,
						created: '2014-06-08 17:51:21',
						name: 'Ja Man!',
						description: 'Lorem ipsum dolor sit amet.',
						url: 'https://www.dropbox.com/s/jskn2covo3kbqtb/IMG263.jpg',
						author: {
							id: 1,
							name: 'Olivier Jansen',
							email: 'oli4jansen.nl@gmail.com'
						}
					}, {
						id: 100,
						created: '2014-06-08 18:11:21',
						name: 'Say It Ain\'t So',
						description: 'Music video by Weezer performing Say It Ain\'t So. (C) 2004 Geffen Records',
						url: 'https://www.youtube.com/watch?v=ENXvZ9YRjbo',
						author: {
							id: 1,
							name: 'Olivier Jansen',
							email: 'oli4jansen.nl@gmail.com'
						}
					}, {
						id: 43,
						created: '2014-06-02 12:00:00',
						name: 'The Main Project File',
						description: 'This is the main project file that will be drukked at the drukkerij later on.',
						url: 'https://docs.google.com/spreadsheets/d/1RHtSS-ANaxPdzwDat8XUK20zwzmIdXPFYEYeVmSMWj0/edit?usp=sharing',
						author: {
							id: 1,
							name: 'Olivier Jansen',
							email: 'oli4jansen.nl@gmail.com'
						}
					}, {
						id: 1,
						created: '2014-06-01 12:00:00',
						name: 'Cover Photo',
						description: 'Has to be cropped before using.',
						url: 'https://www.dropbox.com/s/gylf6tc9bhlre38/562728_460026100778242_458967725_n.jpg',
						author: {
							id: 1,
							name: 'Olivier Jansen',
							email: 'oli4jansen.nl@gmail.com'
						}
					}]
			}
		};

		if(result.status == 200) {
			callback(result.data.files);
		}else{
			alert('Something went wrong. Please reload the page.');
			callback('');
		}
	};

	factory.postNewTask = function(projectId, userId, name, description, assignTo, callback) {
		/*
			Pass data + token to API
		*/
		var result = {
			status: 200,
			data: {
				task: {
					id: '1342',
					name: name,
					description: description,
					assignedBy: {
						id: 1,
						name: 'Olivier Jansen'
					},
					assignedTo: {
						id: 7,
						name: 'Kevin Doan'
					},
					finished: false,
					hours: 0
				}
			}
		};

		console.log(result.data.task);

		if(result.status == 200) {
			callback(false, result.data.task);
		}else{
			callback(true, {});
		}
	};

	factory.postNewMessage = function(projectId, body, callback) {
		/*
			Pass data + token to API
		*/
		var result = {
			status: 200,
			data: {
				message: {
					id: 5000,
					created: '2014-06-07 10:00:00',
					body: body,
					author: {
						id: 1,
						name: 'Olivier Jansen',
						email: 'oli4jansen.nl@gmail.com'
					}
				}
			}
		};

		if(result.status == 200) {
			callback(false, result.data.message);
		}else{
			callback(true, {});
		}
	};

	factory.postNewItem = function(projectId, name, url, description, callback) {

		// Parse URL before calling API

		fileFactory.setURL(url);
		console.log('Host:'+fileFactory.parsedURL.host);

		/*
			Pass data + token to API
		*/
		var result = {
			status: 200,
			data: {
				file: {
					id: '1343',
					created: '2014-06-02 12:00:00',
					type: 'document',
					name: name,
					description: description,
					url: url,
					author: {
						id: 1,
						name: 'Olivier Jansen',
						email: 'oli4jansen.nl@gmail.com'
					}
				}
			}
		};

		if(result.status == 200) {
			callback(false, result.data.file);
		}else{
			callback(true, {});
		}
	};

	factory.deleteMessage = function(messageId, callback) {
		/*
			Pass data + token to API
		*/
		var result = {
			status: 200,
			data: {}
		};

		if(result.status == 200) {
			callback(false, {});
		}else{
			callback(true, {});
		}
	};

	factory.finishTask = function(id, evaluation, hours) {
		/*
			Pass data + token to API
		*/
		var result = {
			status: 200,
			data: {}
		};

		if(result.status == 200) return true;
		return false;
	};

	factory.invite = function(email, callback) {
		/*
			Pass data + token to API
		*/
		var result = {
			status: 200,
			data: {}
		};

		if(result.status == 200) {
			callback(false);
		}else{
			callback('Error message');
		}
	};

	return factory;
});
