const express = require("express");

const router = express.Router();
const Passenger = require("../../models/Passenger");
const isEmpyt = require("../../validation/is-empty");

// @route GET api/passenger/
// @desc get all or filter
// @access Public
router.get("/", (req, res) => {
  filter = {};
  req.query.name ? (filter.name = new RegExp(escapeRegex(req.query.name), "gi")) : "";

  Passenger.find(filter, (err, doc) => {
    if (err) return res.status(400).json({ error: "Erro na busca" });
    res.json(doc);
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// @route GET api/passenger/:id
// @desc get by id
// @access Public
router.get("/:id", (req, res) => {
  Passenger.findById(req.params.id, (err, doc) => {
    if (err) return res.status(400).json({ error: "Erro na busca" });
    res.json(doc);
  });
});

// @route POST api/passenger/
// @desc add new 
// @access Public
router.post("/", (req, res) => {
  Passenger.find({ name: req.body.name }).then(doc => {
    if (!isEmpyt(doc))
      return res.status(400).json({ error: "Passageiro já existe" });

    const newPassenger = new Passenger({
      name: req.body.name
    });

    newPassenger
      .save()
      .then(Local => res.json({ msg: "Adicionado com sucesso" }))
      .catch(err => console.log(err));
  });
});

// @route PUT api/passenger/edit
// @desc update 
// @access Public
router.put("/edit", (req, res) => {
  const id = req.body.id;

  const editPassenger = {
    name: req.body.name
  };

  Passenger.findByIdAndUpdate(id, editPassenger, (err, doc) => {
    if (err)
      return res
        .status(400)
        .json({ error: "Não foi possivel realizar a alteração" });

    return res.json({ msg: "Alteração realizada com sucesso!" });
  });
});

module.exports = router;
