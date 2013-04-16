

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
