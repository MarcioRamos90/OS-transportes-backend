const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const ServiceSchema = new Schema({
  os_cod: { type: Number, required: true, defaultView: counterIncrement = 1 },
});

module.exports = Service = mongoose.model("services", ServiceSchema);
