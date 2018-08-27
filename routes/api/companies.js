const express = require("express");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const isEmpty = require("../../validation/is-empty");

const router = express.Router();

const Companie = require("../../models/Companie");

// @route GET api/companies/
// @desc get companies
// @access Public
router.get("/", (req, res) => {
  // eval(require("locus"));
  filter = {};
  req.query.name
    ? (filter.name = new RegExp(escapeRegex(req.query.name), "gi"))
    : "";
  req.query.adress
    ? (filter.adress = new RegExp(escapeRegex(req.query.adress), "gi"))
    : "";
  req.query.phone
    ? (filter.phone = new RegExp(escapeRegex(req.query.phone), "gi"))
    : "";
  req.query.cnpj
    ? (filter.cnpj = new RegExp(escapeRegex(req.query.cnpj), "gi"))
    : "";

  Companie.find(filter, (err, doc) => {
    if (err) return res.status(400).json(err);

    res.json(doc);
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// @route GET api/companies/:id
// @desc get companie by id
// @access Public
router.get("/:id", (req, res) => {
  const id = req.params.id;

  Companie.findById(id, (err, comp) => {
    if (err)
      return res.status(400).json({ id: "Não encontrado empresa com essa id" });

    res.json(comp);
  });
});

// @route POST api/companies/
// @desc add new companie
// @access Public
router.post("/", (req, res) => {
  Companie.findOne({ name: req.body.name }).then(companie => {
    if (companie) {
      return res.status(400).json({ nome: "Empresa já existe" });
    } else {
      const newComp = new Companie({
        name: req.body.name,
        adress: req.body.adress,
        phone: req.body.phone,
        cnpj: req.body.cnpj
      });

      newComp
        .save()
        .then(companie => res.json(companie))
        .catch(err => console.log(err));
    }
  });
});

// @route PUT api/companies/edit
// @desc alt companie
// @access Public

router.put("/edit", (req, res) => {
  const { id } = req.body;
  const company = {
    name: req.body.name,
    adress: req.body.adress,
    phone: req.body.phone,
    cnpj: req.body.cnpj
  };
  Companie.findByIdAndUpdate(id, company, (err, comp) => {
    if (err)
      return res
        .status(400)
        .json({ update: "Não foi possível realizar a alteração" });
    return res.json("Alteração realizada com sucesso!");
  });
});

module.exports = router;
