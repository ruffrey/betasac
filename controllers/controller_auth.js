var Account = require('../models/account.js')
/**
 * Authorization controllers
 */

exports.isAuthorized = function(req, res, next) {
	if(!req.user)
	{
		return res.redirect('/login?message=Log%20in%20first');
	}
	next();
};

exports.isAuthorizedAjax = function(req, res, next) {
	if(!req.user)
	{
		return res.send({
			success: false,
			message: 'Log in first'
		});
	}
	next();
};

exports.isAdmin = function(req, res, next) {
	if(!req.user)
	{
		return res.redirect('/login?message=Log%20in%20first');
	}
	
	Account.findById(req.user, function(err, user) {
		
		if(err) { 
			return res.render('account/authError', {
				title: "Auth error",
				errors: ["You lack permission"]
			}); 
		}
		
		if(!user.admin)
		{
			return res.render('account/authError', {
				title: "Auth error",
				errors: ["You lack permission"]
			}); 
		}
		
		next();
		
	});
	
};
exports.isAdminOrSelf = function(req, res, next) {
	if(!req.user)
	{
		return res.send({
			success: false,
			message: 'Log in first'
		});
	}
	
	if(req.user._id.toString()!=req.params.id && !req.admin)
	{
		//res.statusCode = 401;
		return res.send({
			success: false,
			message: 'You lack permission'
		}); 
	}
	
	/*Account.findById(req.user, function(err, user) {
		
		if(err) { 
			return res.render('account/authError', {
				title: "Auth error",
				errors: ["You lack permission"]
			}); 
		}
		
		
		
		
		
	});*/
	next();
};

exports.loginView = function(req, res) {
	res.render('login', {
		title: 'sign in, friend',
		query: req.query,
		A: {}
	});
};

exports.authError = function(req, res) {
	res.render('account/authError', {
		title: 'Auth error',
		errors: ['You lack permission']
	});
};

exports.logout = function(req, res) {
	req.logout();
	
	res.redirect('/?message=You%20logged%20out');
};
