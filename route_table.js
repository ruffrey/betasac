
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

	app.get('/api/account/kill/:id', controllers.account.api.kill);


	app.get('/', controllers.item.getList);
	app.get('/index', controllers.item.getList);

	
	app.get('/item/create', controllers.auth.isAuthorized);
	//app.post('/item/create', controllers.auth.isAuthorized);
	app.get('/item/create',  controllers.item.view.create);
	
	app.post('/item/create', controllers.item.create);	
	
	
	// needs to go after the other item routes due to the 
	// format of the url
	app.get('/item/:id',  controllers.item.get); 
	
	app.get('/api/item/kill/:id', controllers.item.api.kill);

	app.all('*', controllers['404']);

};
