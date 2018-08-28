const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const CarSchema = new Schema({
  name: { type: String, required: true },
  renavam: { type: String, required: false },
  yearfab: { type: String, required: false },
  chassi: { type: String, required: false },
  date: { type: String, default: moment().format("L") },
  active: { type: Boolean, default: true }
});

module.exports = Car = mongoose.model("cars", CarSchema);
