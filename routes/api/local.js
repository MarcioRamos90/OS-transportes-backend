const express = require("express");

const router = express.Router();
const Local = require("../../models/Local");
const isEmpyt = require("../../validation/is-empty");

// @route GET api/local/
// @desc get all or filter local
// @access Public
router.get("/", (req, res) => {
  filter = {};
  req.query.destiny ? (filter.local = new RegExp(escapeRegex(req.query.destiny), "gi")) : "";
  req.query.adress ? (filter.adress = new RegExp(escapeRegex(req.query.adress), "gi")) : "";

  Local.find(filter, (err, doc) => {
    if (err) return res.status(400).json({ error: "Erro na busca" });
    res.json(doc);
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// @route GET api/local/:id
// @desc get Local by id
// @access Public
router.get("/:id", (req, res) => {
  Local.findById(req.params.id, (err, doc) => {
    if (err) return res.status(400).json({ error: "Erro na busca" });
    res.json(doc);
  });
});

// @route POST api/local/
// @desc add new Local
// @access Public
router.post("/", (req, res) => {
  Local.find({ local: req.body.local }).then(doc => {
    if (!isEmpyt(doc))
      return res.status(400).json({ local: "Local já existe" });

    const newLocal = new Local({
      local: req.body.destiny,
      adress: req.body.adress,
    });

    newLocal
      .save()
      .then(Local => res.json({ msg: "Adicionado com sucesso" }))
      .catch(err => console.log(err));
  });
});

// @route PUT api/local/edit
// @desc update Local
// @access Public
router.put("/edit", (req, res) => {
  const id = req.body.id;

  const localEdit = {
    local: req.body.destiny,
    adress: req.body.adress,
  };

  Local.findByIdAndUpdate(id, localEdit, (err, doc) => {
    if (err)
      return res
        .status(400)
        .json({ update: "Não foi possivel realizar a alteração" });

    return res.json({ local: "Alteração realizada com sucesso!" });
  });
});

module.exports = router;
