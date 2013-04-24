var mongoose = require('mongoose'),
	
	ObjectId = mongoose.Schema.ObjectId,
 
	voteSchema = new mongoose.Schema({
		item_id: ObjectId, // which item
		account_id: ObjectId, // which account
		date: Date,
		val: Number
	});
 
module.exports = mongoose.model('Vote', voteSchema);
