const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PassengerSchema = new Schema({
  name: { type: String, required: false }
});

module.exports = Passenger = mongoose.model("passenger", PassengerSchema);
