var mongoose = require('mongoose'),
	
	ObjectId = mongoose.Schema.ObjectId,
 
	commentSchema = new mongoose.Schema({
		item_id: ObjectId, // which item
		account_id: ObjectId, // which account
		date: Date,
		text: String
	});
 
module.exports = mongoose.model('Comment', commentSchema);
