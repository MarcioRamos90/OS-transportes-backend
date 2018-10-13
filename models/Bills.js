const mongoose = require("mongoose");
require('mongoose-double')(mongoose);

const sequence = require('mongoose-sequence')(mongoose)
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

var SchemaTypes = mongoose.Schema.Types;

const BillSchema = new Schema({
  service: {
  	type: Schema.Types.ObjectId, 
  	ref: 'services'
  },
  os_code: {
  	type: Number 
  },
  name: { 
  	type: String, 
  	required: false 
  },
  os_date: { 
  	type: Date, 
  	required: false 
  },
  value: { 
  	type: SchemaTypes.Double 
  },
  status: { 
  	type: String, 
  	enum: ["open", "close"],
  	default: "open"
  },
  type:{
  	type: String,
  	enum: ["receive", "payment"],
  	default: "receive"
  }
},{ timestamps: true });

// ReceiveSchema.plugin(sequence, {inc_field: 'id'})
// ReceiveSchema.plugin(uniqueValidator, {message: 'This email is already taken'})

module.exports = Bill = mongoose.model("bill", BillSchema);