app.factory('fileFactory', function($sce) {

	// Includes:

	// parseUri 1.2.2
	// (c) Steven Levithan <stevenlevithan.com>
	// MIT License

	var factory = {};


	factory.setURL = function(url) {
		factory.URL = URL;
		factory.provider = {};
		factory.fileType = null;
		factory.showableUrl = null;

		factory.parsedURL = factory.parseUri(url);

		switch(factory.parsedURL.host) {
			/*
				
				Dropbox

				- Documents
				- Pictures
				- Videos

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
					case 'tiff':
						factory.fileType = 'picture';
						factory.showableUrl = 'https://dl.dropboxusercontent.com/'+factory.parsedURL.path;
						break;

					case 'raw':
						factory.fileType = 'picture';
						break;

					// Videos
					case 'mpeg':
					case 'mp4':
					case 'avi':
					case 'divx':
					case 'xvid':
					case 'flv':
					case 'h264':
					case 'mov':
					case 'mkv':
					case 'swf':
						factory.fileType = 'video';
						break;

					default:
						factory.fileType = 'document';
						break;
				}
				break;

			/*
				
				Google Drive

				- Documents

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

			/*
				Old Google Maps
			*/
			case 'maps.google.com':
				factory.provider = { name: 'Google Maps', slug: 'google-maps' };
				factory.fileType = 'location';
				var coords = factory.parsedURL.queryKey.sspn;
				console.log(coords);
				factory.showableUrl = 'http://maps.googleapis.com/maps/api/staticmap?center='+coords+'&zoom='+factory.parsedURL.queryKey.z+'&size=640x300&scale=2';

			/*
				Evernote
			*/
			case 'www.evernote.com':
				factory.provider = { name: 'Evernote', slug: 'evernote' };
				factory.fileType = 'note';
				break;
		}

		// Als er nu nog steeds niks matcht
		if(!factory.fileType) {

			// Nieuwe Google Maps URLs worden niet goed verwerkt
			if(url.indexOf('www.google.com/maps') > -1) {
				factory.provider = { name: 'Google Maps', slug: 'google-maps' };
				factory.fileType = 'location';
				var coords = factory.parsedURL.host.split(',');

				factory.showableUrl =  'http://maps.googleapis.com/maps/api/staticmap?center='+coords[0]+','+coords[1]+'&zoom='+coords[2].substr(0, coords[2].length-1)+'&size=640x300&scale=2';
			}else{
				var fileParts = factory.parsedURL.file.split('.');
				switch(fileParts[fileParts.length - 1].toLowerCase()) {

					// Pictures
					case 'jpg':
					case 'jpeg':
					case 'png':
					case 'gif':
					case 'tiff':
						factory.provider = { name: 'Unknown Source', slug: 'unknown' };
						factory.fileType = 'picture';
						factory.showableUrl = url;
						break;
				}
			}
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