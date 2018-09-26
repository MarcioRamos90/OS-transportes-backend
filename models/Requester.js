const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequesterSchema = new Schema({
  name: { type: String, required: false }
});

module.exports = Requester = mongoose.model("requester", RequesterSchema);
