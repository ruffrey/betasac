var GoogleStrategy = require('passport-google').Strategy
  , LocalStrategy = require('passport-local').Strategy;

exports.GoogleStrategy = function(Account, config) {
	
	return new GoogleStrategy({
			returnURL: config.auth.BASE+'google/return',
			realm: config.auth.REALM
		},
		function(identifier, profile, done) {
			profile.openId = identifier;
			console.log(profile);
			
			Account.findOne({openId: identifier}, function(err, user) {
				if(err) 
				{
					console.log(err);
					return done(err, user);
				}
				if(!user)
				{
					console.log('creating new user');
					new Account(profile).save(function(err, user) {
						done(err, user);
					});
					return;
				}
				
				done(err, user);
				
			});
		}
	);
};

exports.LocalStrategy = function(Account, config) {
	
	return new LocalStrategy(
		function(username, password, done) {
			console.log(username);
			console.log(password);
			Account.findOne({ username: username }, function(err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if (!user.validatePassword(password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				return done(null, user);
			});
		}
	);

};
