var Item = require('mongoose').model('Item'),
	Vote = require('mongoose').model('Vote'),
	ObjectId = require('mongoose').Schema.ObjectId;

exports.api = function(req, res) {
	
};

exports.api.all = function(req, res) {
	
	Vote.find({}, function(err, votes) {
		
		console.log('votes list'.blue.bold, err, votes.length);
		
		if(err)
		{
			return res.send({
				success: false,
				message: err
			});
		}
		
		res.send({
			success: true,
			item_id: req.params.id,
			results: votes
		});
	});
};

exports.api.voteListByItem = function(req, res) {
	
	Vote.find({item_id: req.params.id}, function(err, votes) {
		
		console.log('votes list'.blue.bold, req.params.id.bold, err, votes.length);
		
		if(err)
		{
			return res.send({
				success: false,
				message: err
			});
		}
		
		res.send({
			success: true,
			item_id: req.params.id,
			results: votes
		});
	});
};

exports.api.aggregate = function(req, res) {
	
	Vote.aggregate([
		//{ $match: { item_id: req.params.id } },
		{ 
			$group: { 
				_id: "$item_id",
				sum: { 
				   $sum: "$val" 
				} 
			} 
		}
		//,{ $match: { _id: ObjectId(req.params.id) } }
	], function(err, votes) {
		
		console.log('aggregated'.blue.bold, req.params.id.bold, err, votes);
		
		if(err)
		{
			return res.send({
				success: false,
				message: err
			});
		}
		
		// this is a hack because the mongo
		// aggregation does not seem to work
		var queriedItem = {
			_id: req.params.id,
			sum: 0
		};
		
		votes.forEach(function(o) {
			if(o._id.toString() == req.params.id)
			{
				queriedItem = o;
				return false;
			}
		});
		
		res.send({
			success: true,
			results: queriedItem
		});
	});
};

exports.api.getByUser = function(req, res) {
	Vote.find({account_id: req.params.id}, function(err, votes) {
		res.send({
			success: !err,
			votes: votes,
			errors: err,
		});
	});
};

exports.api.vote = function(req, res){
	
	var vote_val;
	
	if(req.params.val == '1')
	{
		vote_val = 1;
	}
	else if(req.params.val == '-1')
	{
		vote_val = -1;
	}
	else if(req.params.val == '0')
	{
		vote_val = 0;
	}
	else{
		return res.send({
			success: false,
			message: 'Vote val is not supported. Use 0, 1, -1.'
		});
	}
	
	var query = Vote.find();
	
	query.and(
		[
			{account_id: req.user._id}, 
			{item_id: req.params.id}
		]
	)
	.limit(1)
	.exec(function(err, votes) {
		console.log('Results:'.bold.green, err, votes);
		
		if(err)
		{
			return res.send({
				success: false,
				message: err
			});
		}
		
		if(!votes || votes.length==0)
		{
			new Vote({
				
				account_id: req.user._id,
				item_id: req.params.id,
				val: vote_val,
				date: new Date()
				
			}).save(function(err, vt) {
				if(err)
				{
					return res.send({
						success: false,
						message: err
					});
				}
				res.send({
					success: true,
					message: 'Thanks!'
				});
			});
			
			return;
		}
		
		var vote = votes[0];
		
		if(vote.account_id.toString() != req.user._id.toString()
			&& !req.user.admin
		)
		{
			return res.send({
				success: false,
				message: 'Not allowed'
			});
		}
		
		Vote.findByIdAndUpdate(vote._id, {
			
			date: new Date(),
			val: vote_val
			
		}, function(err, itm) {
			if(err)
			{
				return res.send({
					success: false,
					message: err
				});
			}
			res.send({
				success: true,
				message: "Updated your vote!"
			});
		});
		
		
	});
};

