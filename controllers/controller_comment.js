var Item = require('mongoose').model('Item'),
	Comment = require('mongoose').model('Comment');

exports.api = function(req, res) {
	
};

exports.api.getByItem = function(req, res) {
	Comment.find({item_id: req.params.itemid}, function(err, comments) {
		res.send({
			success: !err,
			comments: comments,
			errors: err,
		});
	});
};

exports.api.create = function(req, res) {
	
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
	
	Item.findById(req.params.itemid, function(err, item) {
		if(err)
		{
			return res.send({
				success: false,
				errors: err instanceof Array ? err : [err],
				message: err
			});
		}
		
		if(!item)
		{
			return res.send({
				success: false,
				message: 'That item has been removed or is invalid'
			});
		}
		
		new Comment({
			
			account_id: req.user._id,
			item_id: req.params.itemid,
			text: req.body.text,
			date: new Date()
			
		}).save(function(err, comment) {
			res.send({
				success: !!err,
				message: err || 'Comment posted successfully',
				comment: comment,
				errors: err,
			});
		});
	});
	
};
