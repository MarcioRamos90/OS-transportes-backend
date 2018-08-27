const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const CompanieSchema = new Schema({
  name: { type: String, required: true },
  adress: { type: String, required: false },
  phone: { type: String, required: false },
  cnpj: { type: String, required: false },
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

module.exports = Companie = mongoose.model("companies", CompanieSchema);
