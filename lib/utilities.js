var crypto = require('crypto'),
	config = require('../config');

module.exports = {
	HASH: function(passwd) {
		return crypto
			.createHmac('sha256', config.secret.toString('base64') )
			.update(passwd)
			.digest('base64');
	}
};
