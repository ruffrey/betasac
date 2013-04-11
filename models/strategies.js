var GoogleStrategy = require('passport-google').Strategy
  , LocalStrategy = require('passport-local').Strategy;

exports.GoogleStrategy = function(Account, config) {
	
	return new GoogleStrategy({
			returnURL: config.auth.BASE+'google/return',
			realm: config.auth.REALM
		},
		function(identifier, profile, done) {
			profile.openId = identifier;
			profile.username = profile.email = profile.emails[0].value;
			profile.lastLogin = new Date();
			
			Account.findOne({openId: identifier}, function(err, user) {
				if(err) 
				{
					console.log(err);
					done(err, user);
					return;
				}
				if(!user)
				{
					console.log('creating new user'.bold.blue, profile.email);
					profile.created = new Date();
					
					new Account(profile).save(function(err, user) {
						done(err, user);
					});
					return;
				}
				
				done(err, user);
				
				Account.findByIdAndUpdate(user._id, 
					{ lastLogin: new Date() }, 
					function(err, user) {
						if(err)
						{
							console.log('failed updating lastLogin for'+user._id);
						}
						
						else{
							console.log('updated',user);
						}
					}
				);
				
				
			});
		}
	);
};

exports.LocalStrategy = function(Account, config) {
	
	return new LocalStrategy(
		function(username, password, done) {
			
			Account.findOne({ username: username }, function(err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if (!user.validatePassword(password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				
				
				done(null, user);
				
				Account.findOneAndUpdate({ username: username }, 
					{ lastLogin: new Date() }, 
					function(err, user) {
						if(err)
						{
							console.log('failed updating lastLogin for'+user._id);
						}
					}
				);
			});
		}
	);

};
