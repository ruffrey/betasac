
/**
 * All routes are bound on this page using #bind()
 */

var controllers = require('./controllers/controller_index.js')
  , middleware = require('./lib/middleware.js');


exports.bind = function(app, passport) {
	
	app.all('*', middleware);
	
	
	// Passport local
	app.get('/login', controllers.auth.loginView);
	app.post('/login', 
		passport.authenticate('local', { 
			successRedirect: '/',
			failureRedirect: '/login?message=Try%20again!',
			failureFlash: false 
		}) 
	);
	app.post('/register', controllers.account.create);
	
	
	// Passport google
	app.get('/auth/google', passport.authenticate('google'));
	app.get('/auth/google/return', 
		passport.authenticate('google', { 
			successRedirect: '/', 
			failureRedirect: '/login' 
		}
	));

	
	app.get('/logout', controllers.auth.logout);

	
	app.get('/account/:id', controllers.account.get);
	app.get('/account', 	controllers.account.getList);
	app.post('/account/update', controllers.account.update);


	app.get('/api/account/kill/:id', controllers.auth.isAdminOrSelf, 
		controllers.account.api.kill);
	
	app.get('/api/account/makeAdmin/:id', controllers.auth.isAdmin, 
		controllers.account.api.makeAdmin);
	app.get('/api/account/unmakeAdmin/:id', controllers.auth.isAdmin, 
		controllers.account.api.unmakeAdmin);
	

	app.get('/', controllers.item.getList);
	app.get('/index', controllers.item.getList);
	
	app.get('/expired', controllers.item.getExpiredList);

	
	app.get('/item/create',  controllers.auth.isAuthorized, 
		controllers.item.view.create);
	
	app.post('/item/create', controllers.auth.isAuthorized, 
		controllers.item.create);	
	
	app.get('/item/edit/:id', controllers.item.getEdit);	
	
	
	// needs to go after the other item routes due to the 
	// format of the url
	app.get('/item/:id',  controllers.item.get); 
	
	
	app.get('/comment/:itemid',  controllers.comment.api.getByItem); 
	app.post('/comment/:itemid', controllers.comment.api.create);
	
	app.get('/redir/:url/:itemid', function(req, res){
		res.render('item/redir', {
			url: req.params.url,
			title: 'redir:'+req.params.itemid
		});
	});
	
	app.get('/genre/:genre', controllers.item.getByGenre);
	
	app.get('/byuserid/:userid', controllers.item.getByUserId);
	app.get('/apps/:user', controllers.item.getByUser);
	
	app.get('/api/item/kill/:id', controllers.item.api.kill);
	app.post('/api/item/report/:id',  controllers.item.api.report); 
	
	app.get('/authError', controllers.auth.authError);

	app.all('*', controllers['404']);

};
