
var Item = require('mongoose').model('Item');

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
			title: err || item ? item.title : req.params.id,
			item: item,
			errors: err
		});
	});
	
};

exports.getList = function(req, res) {
	Item.find(function(err, items) {
		
		return res.render('index.ejs', {
			title: '',
			items: items,
			errors: err
		});
	});
};

exports.api = {
	
	kill: function(req, res) {
		Item.findByIdAndRemove(req.params.id, function(err) {
			res.send({
				errors: err ? [err] : [],
				success: !err,
				message: err || "Deleted beta app"
			});
		});
	}
	
};


// POST
exports.create = function(req, res) {
	
    new Item({
		
		last_updated:  	new Date(),
		account_id: 	req.user, // which account posted
		title:			req.body.title || "",
		description: 	req.body.description || "",
		website: 		req.body.website || "",
		start_date: 	req.body.start_date || new Date(),
		end_date: 		req.body.end_date || new Date(),
		genre: 			req.body.genre || "",
		contact: 		req.body.contact || "",
		report:			[]
		
	}).save(function(err, item) {
		
		if(err)
		{
			res.render('item/create', 
				{ 
					title: 'posted your beta',
					warning: 'Error occurred.',
					errors: [err]
				} 
			);
			console.log(err);
			return;
		}
		
		res.render('item/create', 
			{ 
				title: 'posted your beta',
				notify: 'Your beta was posted!!'
			} 
		);
		
	});
	
};
