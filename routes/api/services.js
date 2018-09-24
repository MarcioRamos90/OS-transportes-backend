const express = require("express");
const router = express.Router();

const isEmpyt = require("../../validation/is-empty");

const Service = require('../../models/Service');
const moment = require('moment')

// To reset the id
// Service.counterReset('id', function(err){})

// @route GET api/services/
// @desc get all or filter services
// @access Public
router.get("/", (req, res) => {
	var start = moment('2018-06-10');
	var end = moment('2020-12-01');
	
	filter = {};

	req.query.code
    ? (filter.id = req.query.code)
    : ""
	req.query.company
    ? (filter.company = new RegExp(escapeRegex(req.query.company), "gi")) : ""
  req.query.reserve
    ? (filter.reserve = new RegExp(escapeRegex(req.query.reserve), "gi"))
    : ""
  req.query.passenger
    ? (filter.passenger = new RegExp(escapeRegex(req.query.passenger), "gi"))
    : "";
  req.query.car
    ? (filter.car = new RegExp(escapeRegex(req.query.car), "gi"))
    : "";
  req.query.status === "true"
    ? (filter.status = true)
    : ''
   req.query.status === "false"
    ? (filter.status = false)
    : ''

	const date = {}
	req.query.start ? date.start = req.query.start : date.start = "2000-01-01"
	req.query.end ? date.end = req.query.end : date.end = "2030-01-01"
	console.log(date)
	Service.find({...filter, os_date: { $gte: moment(date.start ), $lte: moment(date.end) }})
		.then(doc => {
			res.status(200).json(doc)
		})
		.catch(err =>{
			res.status(400).json(err)
		})
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// @route GET api/services/:id
// @desc get service by id
// @access Public
router.get("/:id", (req, res) => {
  Service.findById(req.params.id, (err, doc) => {
    if (err) return res.status(400).json({ error: "Erro na busca" });
    ("");
    res.json(doc);
  });
});

// @route POST api/services/
// @desc post new service
// @access Public
router.post('/', (req, res) => {

	const passenger = function(obj, newService) {
		obj.forEach( function(element, index) {

			newService.passenger.push(element)
		});
	}

	const newService = new Service({})
	req.body.date ? newService.os_date = req.body.date : '';
	req.body.requester ? newService.requester = req.body.requester : '';
	req.body.reserve ? newService.reserve = req.body.reserve : '';
	req.body.passenger ? passenger(req.body.passenger, newService) : '';
	req.body.local ? newService.local = req.body.local : '';
	req.body.car ? newService.car = req.body.car : '';
	req.body.driver ? newService.driver = req.body.driver : '';
	req.body.company ? newService.company = req.body.company : '';
	req.body.observation ? newService.observation = req.body.observation : '';
	req.body.status == "" ? (newService.status = true) : '';
  req.body.status === "false" ? (newService.status = false) : '';

  
	newService.save()
		.then(doc => {
			res.json(doc)
			console.log('novo doc: ' + doc)
		})
		.catch(err => {
			console.log(err)
			res.status(400).json(err)

		});
})

// @route PUT api/services/
// @desc put edit service
// @access Public
router.put('/', (req, res) => {
	

	const passenger = function(obj, newService) {
		obj.forEach( function(element, index) {

			editService.passenger.push(element)
		});
	}

	const { id } = req.body;
	const editService = {};
	editService.passenger = new Array();
	req.body.passenger ? passenger(req.body.passenger, editService) : '';
	req.body.os_date ? editService.os_date = req.body.os_date : '';
	req.body.requester ? editService.requester = req.body.requester : '';
	req.body.reserve ? editService.reserve = req.body.reserve : '';
	req.body.local ? editService.local = req.body.local : '';
	req.body.car ? editService.car = req.body.car : '';
	req.body.driver ? editService.driver = req.body.driver : '';
	req.body.company ? editService.company = req.body.company : '';
	req.body.observation ? editService.observation = req.body.observation : '';
	req.body.status === "true" ? (editService.status = true) : '';
  req.body.status === "false" ? (editService.status = false) : '';
  
	Service.findByIdAndUpdate(id, editService, (err, doc) => {
    if (err)
      return res
        .status(400)
        .json({ update: "Não foi possivel realizar a alteração" });

    return res.json({ carro: "Alteração realizada com sucesso!" });
  });
})

module.exports = router