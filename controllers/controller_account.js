var Account = require('../models/account.js'),
	u = require('../lib/utilities');

exports.get = function(req, res) {
	var query = Account.find();
	
    query.or([
			
			{username: req.params.id},
			{openId: req.params.id}
			
		])
		.limit(1)
		.exec( function(err, account) {
			
			if(err || (account && account.length>0) )
			{
				return res.render('account/accountPage.ejs', {
					title: account.username || req.params.id,
					account: account instanceof Array ? account[0] : account,
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
	},
	
	makeAdmin: function(req, res) {
		Account.findByIdAndUpdate(req.params.id, {admin: true}, function(err) {
			res.send({
				errors: err ? [err] : [],
				success: !err,
				message: err || "Set admin"
			});
		});
	},
	
	unmakeAdmin: function(req, res) {
		Account.findByIdAndUpdate(req.params.id, {admin: false}, function(err) {
			res.send({
				errors: err ? [err] : [],
				success: !err,
				message: err || "Set NOT admin"
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
		email: req.body.email,
		lastLogin: new Date(),
		created: new Date(),
		password: u.HASH(req.body.password)
		
	}).save(function(err, user){
		req.login(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/?message=Welcome+to+betasac.');
		});
	});

	
};


exports.update = function(req, res) {
	
	if(req.user && req.user._id != req.body._id)
	{
		return res.redirect('/account/'+req.body._id
			+'?message=You%20cannot%20update%20someone%20else');
	}
	
	if(req.body.password && req.body.password.length < 6)
	{
		return res.redirect('/account/'+req.body._id
			+'?message=Password%20must%20be%206%20characters%20or%20longer');
	}
	
	var acct_updates = {
		username: req.body.username,
		name: {
			familyName: req.body.familyName || "",
			givenName: req.body.givenName || "",
			middleName: req.body.middleName || ""
		},
		email: req.body.email
	};
	
	if(req.body.password)
	{
		acct_updates.password = u.HASH(req.body.password);
	}
	
	Account.findOne({username: req.body.username}, function(err, usr) {
		if(err)
		{
			return res.redirect('/account/'+req.body._id
				+'?errorMessage='+encodeURIComponent(err));
		}
		
		
		if(usr && usr._id != req.body._id)
		{
			return res.redirect('/account/'+req.body._id
				+'?errorMessage='+encodeURIComponent('Username already exists'));
		}
		
		doUpdate();
		
	});
	
	function doUpdate() {
		Account.findByIdAndUpdate(req.body._id, acct_updates,
			function(err, user){
				
				if(err)
				{
					return res.redirect('/account/'+req.body._id
					+'?errorMessage='+encodeURIComponent(err));
				}
				
				res.redirect('/account/'+req.body._id
					+'?message=Success');
			});
	}
	
	
};
