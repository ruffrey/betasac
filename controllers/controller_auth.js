
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

exports.loginView = function(req, res) {
	res.render('login', {
		title: 'sign in, friend',
		query: req.query,
		A: {}
	});
};

exports.logout = function(req, res) {
	req.logout();
	
	res.redirect('/?message=You%20logged%20out');
};
