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

// @route POST api/companies/test
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

// @route PUT api/companies/
// @desc alt companie
// @access Public
router.put("/edit", (req, res) => {
  const { id } = req.body;
  Companie.findByIdAndUpdate(id).then(comp => {
    if (!comp) {
      return res.status(400).json({ error: "Empresa não encontrada" });
      // Continue....
    }
  });
});

module.exports = router;
