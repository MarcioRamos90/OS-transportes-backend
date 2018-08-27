const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CarSchema = new Schema({
  name: { type: String, required: true },
  renavam: { type: String, required: false },
  yearfab: { type: Date, required: false },
  chassi: { type: String, required: false },
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

module.exports = Car = mongoose.model("cars", CarSchema);
