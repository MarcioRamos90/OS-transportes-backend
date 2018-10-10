const mongoose = require("mongoose");
require('mongoose-double')(mongoose);

const sequence = require('mongoose-sequence')(mongoose)
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

var SchemaTypes = mongoose.Schema.Types;

const ReceiveSchema = new Schema({
  service: {type: Schema.Types.ObjectId, ref: 'services'},
  value: { type: SchemaTypes.Double }
},{ timestamps: true });

// ReceiveSchema.plugin(sequence, {inc_field: 'id'})
// ReceiveSchema.plugin(uniqueValidator, {message: 'This email is already taken'})

module.exports = Receive = mongoose.model("receive", ReceiveSchema);