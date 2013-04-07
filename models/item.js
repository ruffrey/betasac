var mongoose = require('mongoose'),
	
	ObjectId = mongoose.Schema.ObjectId,
 
	itemSchema = new mongoose.Schema({
		last_updated: Date,
		title: String,
		account_id: ObjectId, // which account posted
		description: String,
		website: String,
		image: String,
		start_date: Date,
		end_date: Date,
		test_type: String,
		genre: Array,
		contact: String,
		reports: Array
	});
 
module.exports = mongoose.model('Item', itemSchema);
