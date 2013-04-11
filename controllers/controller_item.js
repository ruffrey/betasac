
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
		if(item && req.user && item.account_id != req.user._id.toString())
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
	Item.find(
		{
			genre: req.params.genre.toLowerCase()
		}, 
		function(err, items) {
			res.render('index.ejs', {
				title: 'genre: '+req.params.genre,
				items: items,
				errors: err
			});
		}
	);
};

exports.getList = function(req, res) {
	Item.find(function(err, items) {
		
		res.render('index.ejs', {
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
		description: 	req.body.description || "",
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
			
			if(item.account_id!=req.user)
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
