
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
			title: err || ( item ? item.title : req.params.id) ,
			item: item,
			errors: err
		});
	});
	
};

exports.getEdit = function(req, res) {
		
	Item.findOne({ _id: req.params.id }, function(err, item) {
		
		// is this the same user who posted it
		if(item && item.account_id && item.account_id.toString() != req.user._id.toString())
		{
			err = ['Editing not allowed - this is not yours'];
		}
		
		res.render('item/create', {
			title: err || item ? item.title : req.params.id,
			a: item,
			errors: err,
			edit: true
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
	
	var test_type = req.body.test_type || "";
	
	if( test_type instanceof Array )
	{
		test_type = test_type[0];
	}
	
	var item_update = {
		
		last_updated:  	new Date(),
		account_id: 	req.user, // which account posted
		title:			req.body.title || "",
		test_type:		test_type,
		description: 	req.body.description || "",
		website: 		req.body.website || "",
		start_date: 	req.body.start_date ? new Date(req.body.start_date) : new Date(),
		end_date: 		req.body.end_date ? new Date(req.body.end_date) : new Date(),
		genre: 			req.body.genre ? req.body.split(',') : "",
		contact: 		req.body.contact || ""
		
	};
	
	if(req.body._id)
	{
		return Item.findByIdAndUpdate(req.body._id, item_update, callbackHandler);
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
