
var Item = require('mongoose').model('Item'),
	Account = require('mongoose').model('Account'),
	sanitize = require('sanitizer').sanitize;

exports.view = {
	
	create: function(req, res) {
		res.render('item/create', 
			{ title: 'posting your beta' } 
		);
		
	}
	
};

exports.get = function(req, res) {
		
	Item.findOne({ _id: req.params.id }, function(err, item) {
		res.render('item/item', {
			title: err || ( item ? item.title : req.params.id) ,
			item: item,
			errors: err
		});
	});
	
};

exports.getEdit = function(req, res) {
		
	Item.findOne({ _id: req.params.id }, function(err, item) {
		
		if(err)
		{
			return res.render('item/item', {
				title: 'error occurred',
				a: item,
				errors: err,
				edit: true
			});
		}
		
		if(!req.user)
		{
			return res.redirect('/login?message=Please%20log%20in');
		}
		
		// is this the same user who posted it
		if(item && req.user 
			&& item.account_id != req.user._id.toString()
			&& !req.user.admin
		)
		{
			err = ['Editing not allowed - this is not yours'];
			return res.render('item/item', {
				title: item.title,
				errors: err,
				item: item
			});
		}
		
		res.render('item/create', {
			title: item.title,
			a: item
		});
	});
	
};

exports.getByGenre = function(req, res) {
	var genre = req.params.genre.toLowerCase().split(' ');
		
	Item.find({
		genre: { $in: genre },
		end_date: { $gte: new Date() }
	},
		function(err, items) {
			res.render('index.ejs', {
				title: (genre.length>1 ? 'genres: ' : 'genre: ') 
					+ req.params.genre,
				items: items,
				errors: err
			});
		}
	);
};

exports.getByUserId = function(req, res) {
	Item.find(
		{
			account_id: req.params.userid
		}, 
		function(err, items) {
			res.render('index.ejs', {
				title: 'user: '+req.params.userid,
				items: items,
				errors: err
			});
		}
	);
};
exports.getByUser = function(req, res) {
	
	Account.findOne({username: req.params.user}, function(err, user) {
		if(err)
		{
			return res.render('index.ejs', {
				title: 'oopsie',
				items: [],
				errors: [err]
			});
		}
		
		if(!user)
		{
			return res.render('index.ejs', {
				title: 'nobody has that username',
				items: []
			});
		}
		
		getItems(user._id);
		
	});
	
	function getItems(_id) {
		Item.find(
			{
				account_id: _id
			}, 
			function(err, items) {
				res.render('index.ejs', {
					title: 'user: '+req.params.user,
					items: items,
					errors: err
				});
			}
		);
	}
	
};

exports.getList = function(req, res) {
	Item.find({
		end_date: {$gte: new Date()}
	}, 
	function(err, items) {
		
		res.render('index.ejs', {
			title: '',
			items: items,
			errors: err
		});
	});
};

exports.getExpiredList = function(req, res) {
	Item.find({
		end_date: {$lt: new Date()}
	},
	function(err, items) {
		
		res.render('index.ejs', {
			title: 'expired betas',
			items: items,
			errors: err
		});
	});
};

exports.api = {
	
	kill: function(req, res) {
		
		if(!req.user)
		{
			return res.send({
				success: false,
				message: 'You must be logged in'
			});
		}
		
		Item.findById(req.params.id, function(err, item) {
			if(err || !item)
			{
				return res.send({
					success: false,
					message: 'Unable to retrieve '+req.params.id,
					errors: [err]
				});
			}
			
			if(item.account_id != req.user._id.toString() && !req.user.admin)
			{
				return res.send({
					success: false,
					message: 'You can only delete your own posts'
				});
			}
			
			killIt();
		});
		
		function killIt() {
			Item.findByIdAndRemove(req.params.id, function(err) {
				res.send({
					errors: err ? [err] : null,
					success: !err,
					message: err || "Deleted app post "+req.params.id
				});
			});
		}
		
	},
	report: function(req, res){
		if(!req.user)
		{
			return res.send({
				success: false,
				message: 'You must be logged in'
			});
		}
		
		if(!req.body.text)
		{
			return res.send({
				success: false,
				message: 'You need to say something'
			});
		}
		
		Item.findById(req.params.id, function(err, item) {
			if(err || !item)
			{
				return res.send({
					success: false,
					message: 'Unable to retrieve '+req.params.id,
					errors: [err]
				});
			}
			
			var already_reported = false;
			for(var i=0; i<item.reports.length; i++)
			{
				if(item.reports[i].account_id==req.user._id.toString())
				{
					already_reported = true;
					break;
				}
			}
			
			if(already_reported)
			{
				return res.send({
					success: false,
					message: 'You already reported this one'
				});
			}
			
			Item.findByIdAndUpdate(req.params.id, {
				$push: {
					reports: {
						account_id: req.user._id,
						text: req.body.text,
						date: new Date()
					}
				}
			}, function(err, itm) {
				res.send({
					errors: err ? [err] : null,
					success: !err,
					message: err || "Thanks for reporting"
				});
			});
			
		});
	}
	
};


// POST
exports.create = function(req, res) {
	
	var test_type = req.body.test_type || "";
	
	if( test_type instanceof Array )
	{
		test_type = test_type[0];
	}
	
	var genre = req.body.genre.toLowerCase().replace(/\s/g,',').split(',');
	
	for(var i=0; i<genre.length; i++)
	{
		if(!genre[i])
		{
			genre.splice(i,1);
			i--;
		}
	}
	
	
	var item_update = {
		
		last_updated:  	new Date(),
		account_id: 	req.user, // which account posted
		title:			req.body.title || "",
		test_type:		test_type,
		description: 	sanitize(req.body.description || "").replace(/\n/g,'<br />'),
		website: 		req.body.website || "",
		image:	 		req.body.image || "",
		start_date: 	req.body.start_date ? new Date(req.body.start_date) : new Date(),
		end_date: 		req.body.end_date ? new Date(req.body.end_date) : new Date(),
		genre: 			genre,
		contact: 		req.body.contact || ""
		
	};
	
	if(req.body._id)
	{
		Item.findById(req.body._id, function(err, item) {
			if(err)
			{
				return res.render('item/create', 
					{ 
						title: 'posting your beta',
						warning: 'Error occurred.',
						errors: [err],
						a: item_update
					} 
				);
			}
			
			if(item.account_id.toString()!=req.user._id.toString())
			{
				return res.render('item/create', 
					{ 
						title: 'posted your beta',
						warning: 'You can only update your own posts!',
						a: item_update
					} 
				);
			}
			
			Item.findByIdAndUpdate(req.body._id, item_update, callbackHandler);
		});
		return;
	}
	
	item_update.report = [];
	
    new Item(item_update).save(callbackHandler);
	
	function callbackHandler(err, item) {
		
		if(err)
		{
			res.render('item/create', 
				{ 
					title: 'posted your beta',
					warning: 'Error occurred.',
					errors: [err],
					a: item_update
				} 
			);
			console.log(err);
			return;
		}
		
		res.redirect('/item/'+item._id+'?message=App+posted+successfully');
		
	}
};
