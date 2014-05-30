var fs = require('fs');
var morgan = require('morgan');
var express = require('express');

var app = express();

// Log requests
app.use(morgan('dev'));

// Send correct headers for the cache manifest
app.use(function(req, res, next) {
	if (req.url === '/manifest.appcache') {
		res.setHeader('Content-Type', 'text/cache-manifest');
		res.setHeader('Cache-Control', 'max-age=31536000'); // 1 year
		fs.createReadStream(__dirname + '/public' + req.url).pipe(res);
	} else {
		return next();
	}
});

// Serve static files
app.use(express.static(__dirname + '/public'));

app.listen(1337 || process.env.PORT);
