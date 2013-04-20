var config = require('../config.js'),
	crypto = require('crypto');

module.exports = [

	// Respond with data as JSON if specified by client
	function(req, res, next) {
		var c_typ = req.get('Accepts') || "",
			renderAsJson = false;
		
		if( req.url.indexOf('/json/')>-1)
		{
			req.url.replace('/json/', '/');
			renderAsJson = true;
		}
		else if(c_typ.toLowerCase().indexOf('json')>-1)
		{
			renderAsJson = true;
		}
		
		if(renderAsJson)
		{
			res.set('Content-Type', 'application/json');
			res.render = function(a, b) {
				res.send(JSON.stringify(b));
			};
		}
		
		next();
	},
	
	// Local variables
	function(req, res, next) {
		res.locals.config = config;
		res.locals.app_messages = [];
		
		// temporarily do this in case redis is MIA
		if(typeof(req.session)== 'undefined')
		{
			req.session = {};
			res.locals.app_messages.push({
				text: "Redis session service is unavailable.",
				label: "important"
			});
		}
		
		if(req.user)
		{
			res.locals.user = req.user;
		}
		else{
			res.locals.user = null;
		}
		
		res.locals.query = req.query;
		
		res.locals.session = req.session;
		
		res.locals.sanitize = require('sanitizer').sanitize; // html sanitizer
		
		next();
	}
];
