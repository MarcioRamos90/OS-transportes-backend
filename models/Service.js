const mongoose = require("mongoose");
const sequence = require('mongoose-sequence')(mongoose)
const Schema = mongoose.Schema;
const moment = require("moment");
const uniqueValidator = require('mongoose-unique-validator')

const ServiceSchema = new Schema({
  id: {type: Number, unique:true, index: true },
  company: [{
      name: { type: String, required: false }
    }],
  os_date: { type: Date, required: false },
  hour: { type: String, required: false },
  requesters: [
    {name: { type: String, required: false }}
    ],
  reserve: { type: String, required: false },
  passengers: [
    {name: { type: String, required: false }}
    ],  
  destinys: [
    {
      local: { type: String, required: false },
      adress: { type: String, required: false }
    }
  ],
  observation: { type: String, required: false },
  car:[{ 
      name:{ type: String, required: false }
    }],
  driver: [{
      name: { type: String, required: false }
    }
  ],
  status: {type: Boolean, default: true}
},{ timestamps: true });

ServiceSchema.plugin(sequence, {inc_field: 'id'})
ServiceSchema.plugin(uniqueValidator, {message: 'This email is already taken'})

module.exports = Service = mongoose.model("services", ServiceSchema);
