var mongoose = require('mongoose'),
	findOrCreate = require('mongoose-findorcreate'),
	crypto = require('crypto'),
	config = require('../config.js'),
	
AccountSchema = mongoose.Schema({
	provider: 	String,
	username: 	String,
	created: 	Date,
	lastLogin:	Date,
	password: 	String,
	openId: 	String,
	admin:		Boolean,
	name: {
		familyName: String,
		givenName: String,
		middleName: String
	},
	email: String
});


/* hashing password, same as req.HASH */
AccountSchema.methods.validatePassword = function(passwd) {
	return this.password == crypto
		.createHmac('sha256', config.secret.toString('base64') )
		.update(passwd)
		.digest('base64');
};

AccountSchema.plugin(findOrCreate);
	
module.exports = mongoose.model('Account', AccountSchema);

