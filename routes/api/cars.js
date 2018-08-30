const express = require("express");

const router = express.Router();

const Car = require("../../models/Car");

// @route GET api/users/test
// @desc Test cars routers
// @access Public
router.get("/", (req, res) => {
  filter = {};
  req.query.name
    ? (filter.name = new RegExp(escapeRegex(req.query.name), "gi"))
    : "";
  req.query.renavam
    ? (filter.renavam = new RegExp(escapeRegex(req.query.renavam), "gi"))
    : "";
  req.query.yearfab
    ? (filter.yearfab = new RegExp(escapeRegex(req.query.yearfab), "gi"))
    : "";
  req.query.chassi
    ? (filter.chassi = new RegExp(escapeRegex(req.query.chassi), "gi"))
    : "";
  req.query.active === "true"
    ? (filter.active = true)
    : (filter.active = false);

  Car.find(filter, (err, doc) => {
    if (err) return res.status(400).json({ error: "Erro na busca" });

    res.json(doc);
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// @route GET api/cars/:id
// @desc get car by id
// @access Public
router.get("/:id", (req, res) => {
  const id = req.params.id;

  Car.findById(id, (err, doc) => {
    if (err) return res.status(400).json({ err: "Não encontrado carro!" });

    return res.json(doc);
  });
});

// @route POST api/cars/
// @desc add new car
// @access Public
router.post("/", (req, res) => {
  Car.findOne({ name: req.body.name }).then(car => {
    if (car) return res.status(400).json({ nome: "Carro já existe!" });

    const newCar = new Car({
      name: req.body.name,
      renavam: req.body.renavam,
      yearfab: req.body.yearfab,
      chassi: req.body.chassi,
      active: req.body.active
    });

    newCar
      .save()
      .then(car => res.json(car))
      .catch(err => console.log(err));
  });
});

// @route PUT api/cars/edit
// @desc alt car
// @access Public
router.put("/edit", (req, res) => {
  const { id } = req.body;
  const car = {
    name: req.body.name,
    renavam: req.body.renavam,
    yearfab: req.body.yearfab,
    chassi: req.body.chassi,
    active: req.body.active
  };

  Car.findByIdAndUpdate(id, car, (err, doc) => {
    if (err) {
      return res
        .status(400)
        .json({ uptade: "Não foi possivel realizar a alteração" });
    }
    return res.json({ carro: "Alteração realizada com sucesso!" });
  });
});

module.exports = router;
