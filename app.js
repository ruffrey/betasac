

/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , dateUtils = require('date-utils')
  , colors = require('colors')
  , engine = require('ejs-locals')
  , RedisStore = require('connect-redis')(express)
  , expressLayouts = require('express-ejs-layouts')
  , config = require('./config.js')
  , middleware = require('./lib/middleware')
  
  , mongoose = require('mongoose')
  
  , Account = require('./models/account.js')
  , Item = require('./models/item.js')
  , Comment = require('./models/comment.js')
  , Vote = require('./models/vote.js')
  
  , passport = require('passport')
  , strategies = require('./models/strategies.js')
  
  
  , route_table = require('./route_table');
	
	
	mongoose.set('debug', true);
	

/**
 * vars
 */
/* date formatted */
global.D = function() {
	if(arguments[0])
	{
		return ( new Date(arguments[1]) ).toFormat('YYYY-MM-DD H24:MI:SS:MS');
	}
	return ( new Date() ).toFormat('YYYY-MM-DD HH24:MI:SS:MS');
};


var app = express();


// First and foremost, logger
app.configure(function(){
	app.use(express.logger('dev'));
});

mongoose.connect(config.Mongo.url);
var MongoConnection = mongoose.connection;

MongoConnection.on('error', function(e) {
	console.log( D(), 'Mongo'.red.bold, 'connection error', e);
	MongoConnection = mongoose.connect(config.Mongo.url);
	MongoConnection.once('open', function() {
		console.log( D(), 'Mongo'.blue.bold, 'connected' );
	});
});

MongoConnection.once('open', function() {
	console.log( D(), 'Mongo'.blue.bold, 'connected' );
});


// Registering mongoose models for global usage on mongoose require

mongoose.model('Account', Account.Account);
mongoose.model('Item', Item.Item);
mongoose.model('Comment', Comment.Comment);
mongoose.model('Vote', Vote.Vote);


// Configurations
app.configure(function(){
	
	app.use(express.cookieParser(config.secret));
	
	app.use(express.static(path.join(__dirname, 'public')));
	
	app.set('config', config);
	
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	
	app.use(express.session({ 
		store: new RedisStore(config.Redis), 
		secret: config.secret,
		maxAge: false
	}));
	
	
	
	// Passport Authentication
	
	app.use(passport.initialize());
	app.use(passport.session());
  
	passport.use( strategies.GoogleStrategy(Account, config) );

	passport.use( strategies.LocalStrategy(Account, config) );

	
	passport.serializeUser(function(account, done) {
		done(null, account.id);
	});

	passport.deserializeUser(function(id, done) {
		Account.findById(id, function(err, account) {
			done(err, account);
		});
	});
	
  
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
  
	app.engine('ejs', engine);
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	
	app.use(expressLayouts);
	
	// use the URL router middleware
	app.use(app.router);
	
});

app.configure('development', function(){
	app.use(express.errorHandler());
});


// Router is bound here
route_table.bind(app, passport);

// Starting up the app
http.createServer(app).listen(app.get('port'), function(){
	console.log(D(), "Betasac is alive on port ".blue.bold, app.get('port'));
	console.log("config".bold.inverse, config);
});
