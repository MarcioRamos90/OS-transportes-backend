const mongoose = require("mongoose");
const sequence = require('mongoose-sequence')(mongoose)
const Schema = mongoose.Schema;
const moment = require("moment");
const uniqueValidator = require('mongoose-unique-validator')

const ServiceSchema = new Schema({
  id: {type: Number, unique:true, index: true },
  company: { type: String, required: false },
  os_date: Date,
  requester: { type: String, required: false },
  passenger: [{ type: String, required: false }],  
  local: [
    {
      destiny: { type: String, required: false },
      adress: { type: String, required: false }
    }
  ],
  observation: { type: String, required: false },
  car: { type: String, required: false },
  driver: {
    type: Schema.Types.ObjectId,
    ref: "drivers"
  },
  status: {type: Boolean, default: true}
},{ timestamps: true });

ServiceSchema.plugin(sequence, {inc_field: 'id'})
ServiceSchema.plugin(uniqueValidator, {message: 'This email is already taken'})

module.exports = Service = mongoose.model("services", ServiceSchema);
