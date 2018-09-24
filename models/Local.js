const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocalSchema = new Schema({
  local: { type: String, required: false },
  adress: { type: String, required: false },
});

module.exports = Local = mongoose.model("local", LocalSchema);
