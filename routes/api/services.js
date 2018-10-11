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

  req.query.code ? filter.id =  req.query.code : "";

  req.query.company.length > 0 ? filter = { 'company.name': new RegExp(escapeRegex(req.query.company), "gi") } : ''
  req.query.reserve.length > 0 ? filter = { ...filter, 'reserve': new RegExp(escapeRegex(req.query.reserve), "gi") } : ''
  req.query.passenger.length > 0 ? filter = { ...filter, 'passengers.name': new RegExp(escapeRegex(req.query.passenger), "gi") } : ''
  req.query.requester.length > 0 ? filter = { ...filter, 'requesters.name': new RegExp(escapeRegex(req.query.requester), "gi") } : ''
  req.query.driver.length > 0 ? filter = { ...filter, 'driver.name': new RegExp(escapeRegex(req.query.driver), "gi") } : ''
  req.query.car.length > 0 ? filter = { ...filter, 'car.name': new RegExp(escapeRegex(req.query.car), "gi") } : ''
  req.query.hour.length > 0 ? filter = { ...filter, 'hour': new RegExp(escapeRegex(req.query.hour), "gi") } : ''

  req.query.status === "true"
    ? (filter.status = true)
    : ''
   req.query.status === "false"
    ? (filter.status = false)
    : ''

  // console.log(filter)
	const date = {}
	req.query.start ? date.start = req.query.start : date.start = "2000-01-01"
	req.query.end ? date.end = req.query.end : date.end = "2030-01-01"

	//os_date: { $gte: moment(date.start ), $lte: moment(date.end) }
	Service.find(
		{
			...filter,
			os_date: { $gte: moment(date.start ), $lte: moment(date.end)} 
		})
		.then(doc => {
			res.status(200).json(doc)
		})
		.catch(err =>{
			res.status(400).json(err)
		})
});

function escapeRegex(text) {
	if(text){
  	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
	}
	else{
		return false
	}
}

// @route GET api/services/:id
// @desc get service by id
// @access Public
router.get("/:id", (req, res) => {
  Service.findById(req.params.id, (err, doc) => {
    if (err) return res.status(400).json({ error: "Erro na busca" });
    res.json(doc);
  });
});

// @route POST api/services/
// @desc post new service
// @access Public
router.post('/', (req, res) => {

	const passenger = function(obj, newService) {
		obj.forEach( function(element, index) {

			newService.passengers.push(element)
		});
	}

	const newService = new Service({})

	req.body.company ? newService.company = req.body.company : newService.company = {};
	req.body.passenger ? newService.passengers = req.body.passenger  : '';
	req.body.date ? newService.os_date = req.body.date : '';
	req.body.requester ? newService.requesters = req.body.requester : '';
	req.body.reserve ? newService.reserve = req.body.reserve : '';
	req.body.driver ? newService.driver = req.body.driver : '';
	req.body.car ? newService.car = req.body.car : '';
	req.body.destiny ? newService.destinys = req.body.destiny : '';
	req.body.hour ? newService.hour = req.body.hour : '';
	req.body.observation ? newService.observation = req.body.observation : '';
	req.body.status == "" ? (newService.status = true) : '';
  req.body.status === "false" ? (newService.status = false) : '';
  
  req.body.value_receive 
  	? newService.value_receive = req.body.value_receive : newService.value_receive = 0
  req.body.value_to_pay 
  	? newService.value_to_pay = req.body.value_to_pay : newService.value_to_pay = 0

	newService.save()
		.then(doc => {
			res.json(doc)
		})
		.catch(err => {
			res.status(400).json(err)
		});
})

// @route PUT api/services/edit
// @desc put edit service
// @access Public
router.put('/edit', (req, res) => {
	
	const passenger = function(obj, newService) {
		obj.forEach( function(element, index) {

			editService.passengers.push(element)
		});
	}

	const { id } = req.body;
	const editService = {};
	editService.passengers = new Array();

	req.body.company ? editService.company = req.body.company : '';
	req.body.passenger ? editService.passengers = req.body.passenger  : '';
	req.body.date ? editService.os_date = req.body.date : '';
	req.body.requester ? editService.requesters = req.body.requester : '';
	
	req.body.driver ? editService.driver = req.body.driver : '';
	req.body.car ? editService.car = req.body.car : '';
	req.body.destiny ? editService.destinys = req.body.destiny : '';
	req.body.status == "" ? (editService.status = true) : '';
  req.body.status === "false" ? (editService.status = false) : '';

  editService.observation = req.body.observation
  editService.hour = req.body.hour
  editService.reserve = req.body.reserve
  
	Service.findByIdAndUpdate(id, editService, (err, doc) => {
    if (err)
      return res
        .status(400)
        .json({ update: "Não foi possivel realizar a alteração" });

    return res.json({ msg: "Alteração realizada com sucesso!" });
  });
})

module.exports = router