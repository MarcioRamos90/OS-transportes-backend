const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const DriverSchema = new Schema({
  name: { type: String, required: true },
  tel: { type: String, required: true },
  bilingue: { type: Boolean, default: false },
  cpf: { type: String, required: false },
  rg: { type: String, required: false },
  date: { type: String, default: moment().format("L") },
  active: { type: Boolean, default: true }
});

module.exports = Driver = mongoose.model("drivers", DriverSchema);
