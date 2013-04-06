var Account = require('../models/account.js'),
	u = require('../lib/utilities');

exports.get = function(req, res) {
	var query = Account.find();
	
    query.or([
			
			{username: req.params.id},
			{openId: req.params.id}
			
		]).exec( function(err, account) {
			
			if(account.length>0 || err)
			{
				return res.render('account/accountPage.ejs', {
					title: account.username || req.params.id,
					account: account,
					errors: err
				});
			}
			else{  // or search by _id
				Account.findById(req.params.id, function(err, account2) {
					return res.render('account/accountPage.ejs', {
						title: req.params.id,
						account: account2,
						errors: err
					});
				});
			}
		});
    
};

exports.getList = function(req, res) {
	Account.find(function(err, accounts) {
		
		return res.render('account/accountList.ejs', {
			title: req.params.id,
			accounts: accounts,
			errors: err
		});
	});
};

exports.api = {
	
	kill: function(req, res) {
		Account.findByIdAndRemove(req.params.id, function(err) {
			res.send({
				errors: err ? [err] : [],
				success: !err,
				message: err || "Killed user"
			});
		});
	}
	
};


exports.create = function(req, res) {
	
	if(!req.body.password || req.body.password.length < 6)
	{
		return res.render('login', {
			title: 'try again',
			errors: ['Password must be 6 chars or more'],
			A: req.body
		});
	}
	
	if(req.body.password != req.body.confirmPassword)
	{
		return res.render('login', {
			title: 'try again',
			errors: ['Password must be 6 chars or more'],
			A: req.body
		});
	}
	
	
	
	new Account({
		
		provider: 'local',
		username: req.body.username,
		name: {
			familyName: req.body.familyName,
			givenName: req.body.givenName || '',
			middleName: req.body.middleName || ''
		},
		emails: [{type: 'nome', value: req.body.email}],
		password: u.HASH(req.body.password)
		
	}).save(function(err, user){
		req.login(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/?message=Welcome+to+betasac.');
		});
	});

	
};
