const express = require("express");

const router = express.Router();
const Requester = require("../../models/Requester");
const isEmpyt = require("../../validation/is-empty");

// @route GET api/requester/
// @desc get all or filter
// @access Public
router.get("/", (req, res) => {
  filter = {};
  req.query.name ? (filter.name = new RegExp(escapeRegex(req.query.name), "gi")) : "";

  Requester.find(filter, (err, doc) => {
    if (err) return res.status(400).json({ error: "Erro na busca" });
    res.json(doc);
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// @route GET api/requester/:id
// @desc get by id
// @access Public
router.get("/:id", (req, res) => {
  Requester.findById(req.params.id, (err, doc) => {
    if (err) return res.status(400).json({ error: "Erro na busca" });
    res.json(doc);
  });
});

// @route POST api/requester/
// @desc add new 
// @access Public
router.post("/", (req, res) => {
  Requester.find({ name: req.body.name }).then(doc => {
    if (!isEmpyt(doc))
      return res.status(400).json({ error: "Solicitante já existe" });

    const newRequester = new Requester({
      name: req.body.name
    });

    newRequester
      .save()
      .then(Local => res.json({ msg: "Adicionado com sucesso" }))
      .catch(err => console.log(err));
  });
});

// @route PUT api/requester/edit
// @desc update 
// @access Public
router.put("/edit", (req, res) => {
  const id = req.body.id;

  const editRequester = {
    name: req.body.name
  };

  Requester.findByIdAndUpdate(id, editRequester, (err, doc) => {
    if (err)
      return res
        .status(400)
        .json({ error: "Não foi possivel realizar a alteração" });

    return res.json({ msg: "Alteração realizada com sucesso!" });
  });
});

module.exports = router;
