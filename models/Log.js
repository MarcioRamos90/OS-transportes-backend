const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
	type: {type: String, require: true},
	code: {type: String, require: true},
	user: {type: String, require: true},

}, {timestamp: true});


module.exports = Log = mongoose.model('log', LogSchema);