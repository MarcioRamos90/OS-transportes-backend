const express = require("express");

const router = express.Router();
const Driver = require("../../models/Driver");
const isEmpyt = require("../../validation/is-empty");

// @route GET api/drivers/
// @desc get all or filter drivers
// @access Public
router.get("/", (req, res) => {
  filter = {};
  req.query.name
    ? (filter.name = new RegExp(escapeRegex(req.query.name), "gi"))
    : "";
  req.query.tel
    ? (filter.tel = new RegExp(escapeRegex(req.query.tel), "gi"))
    : "";
  req.query.bilingue ? (filter.bilingue = req.query.bilingue) : "";
  req.query.cpf
    ? (filter.cpf = new RegExp(escapeRegex(req.query.cpf), "gi"))
    : "";
  req.query.rg ? (filter.rg = new RegExp(escapeRegex(req.query.rg), "gi")) : "";
  req.query.active === "true"
    ? (filter.active = true)
    : (filter.active = false);

  Driver.find(filter, (err, doc) => {
    if (err) return res.status(400).json({ error: "Erro na busca" });
    res.json(doc);
  });
});

function verifyBilingue(bilingue) {
  if (bilingue == "true") {
    return true;
  }
  if (bilingue == "false") {
    return;
  }
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// @route GET api/drivers/:id
// @desc get driver by id
// @access Public
router.get("/:id", (req, res) => {
  Driver.findById(req.params.id, (err, doc) => {
    if (err) return res.status(400).json({ error: "Erro na busca" });
    ("");
    res.json(doc);
  });
});

// @route POST api/drivers/
// @desc add new driver
// @access Public
router.post("/", (req, res) => {
  Driver.find({ name: req.body.name }).then(doc => {
    if (!isEmpyt(doc))
      return res.status(400).json({ name: "Motorista já existe" });

    const newDriver = new Driver({
      name: req.body.name,
      tel: req.body.tel,
      bilingue: req.body.bilingue,
      cpf: req.body.cpf,
      rg: req.body.rg,
      active: req.body.active
    });

    newDriver
      .save()
      .then(driver => res.json({ msg: "Adicionado com sucesso" }))
      .catch(err => console.log(err));
  });
});

// @route PUT api/drivers/edit
// @desc update driver
// @access Public

router.put("/edit", (req, res) => {
  const { id } = req.body;
  const driver = {
    name: req.body.name,
    tel: req.body.tel,
    bilingue: req.body.bilingue == true ? true : false,
    cpf: req.body.cpf,
    rg: req.body.rg,
    active: req.body.active
  };

  Driver.findByIdAndUpdate(id, driver, (err, doc) => {
    if (err)
      return res
        .status(400)
        .json({ update: "Não foi possivel realizar a alteração" });

    return res.json({ Motorista: "Alteração realizada com sucesso!" });
  });
});

module.exports = router;
