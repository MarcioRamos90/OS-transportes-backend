const express = require("express");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const router = express.Router();

const Companie = require("../../models/Companie");

// @route GET api/companies/
// @desc get companies
// @access Public
router.get(
  "/",

  (req, res) => {
    Companie.find().then(comp => {
      res.json(comp);
    });
  }
);

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
        phone: req.body.phone
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
    console.log(comp);
    return res.json("Alteração realizada com sucesso!");
  });
});

module.exports = router;
