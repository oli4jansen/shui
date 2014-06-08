app.factory('fileFactory', function($sce) {

	// Includes:

	// parseUri 1.2.2
	// (c) Steven Levithan <stevenlevithan.com>
	// MIT License

	var factory = {};


	factory.setURL = function(url) {
		factory.URL = URL;
		factory.provider = {};
		factory.fileType = '';
		factory.showableUrl = '';

		factory.parsedURL = factory.parseUri(url);

		switch(factory.parsedURL.host) {
			/*
				Dropbox files
			*/
			case 'www.dropbox.com':
			case 'dropbox.com':
			case 'www.dbstatic.com':
			case 'dbstatic.com':
			case 'dl.dropboxusercontent.com':
			case 'dl.dropbox.com':
			case 'dl-web.dropbox.com':
			case 'dl-client.dropbox.com':
				factory.provider = { name: 'Dropbox', slug: 'dropbox' };

				var fileParts = factory.parsedURL.file.split('.');
				switch(fileParts[fileParts.length - 1].toLowerCase()) {
					// Documents
					case 'docs':
					case 'txt':
					case 'doc':
					case 'gif':
						factory.fileType = 'document';
						break;

					// Pictures
					case 'jpg':
					case 'jpeg':
					case 'png':
					case 'gif':
						factory.fileType = 'picture';
						factory.showableUrl = 'https://dl.dropboxusercontent.com/'+factory.parsedURL.path;
						break;

					default:
						factory.fileType = 'document';
						break;
				}
				break;

			/*
				Google Drive files
			*/
			case 'docs.google.com':
			case 'drive.google.com':
				factory.provider = { name: 'Google Drive', slug: 'google-drive' };
				factory.fileType = 'document';
				break;


			/*
				Youtube videos
			*/
			case 'www.youtube.com':
				factory.provider = { name: 'Youtube', slug: 'youtube' };
				factory.fileType = 'video';
				factory.showableUrl =  $sce.trustAsResourceUrl('http://www.youtube.com/embed/'+factory.parsedURL.queryKey.v);
				break;
		}
	};

	factory.parseUri = function(str) {
		var	o   = factory.parseUri.options,
			m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
			uri = {},
			i   = 14;

		while (i--) uri[o.key[i]] = m[i] || "";

		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
			if ($1) uri[o.q.name][$1] = $2;
		});

		return uri;
	};

	factory.parseUri.options = {
		strictMode: false,
		key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
		q:   {
			name:   "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser: {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	};

	return factory;

});