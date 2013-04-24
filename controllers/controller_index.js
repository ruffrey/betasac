var fs = require('fs'),
	md = require("node-markdown").Markdown;

exports.terms = function(req, res) {
	fs.readFile('./README.md', 'utf8', function(err, fileText) {
		
		if(fileText)
		{
			fileText = md(fileText);
		}
		
		res.render('content/terms.ejs', {
			title: 'Terms and Privacy',
			readme: fileText,
			errors: err ? [err] : []
		});
	});
};

exports.admin_page = function(req, res) {
	res.render('content/admin_page.ejs', {
		title: 'Administrator'
	});
};

exports['404'] = function(req, res) {
	res.render('404', {
		title: 'Not found',
		path: req.path,
		method: req.method,
		message: 'Resource not found'
	});
};


exports.account = require('./controller_account.js');
exports.item = require('./controller_item.js');
exports.auth = require('./controller_auth.js');
exports.comment = require('./controller_comment.js');
exports.vote = require('./controller_vote.js');
