const express = require("express");
const router = express.Router();

const isEmpyt = require("../../validation/is-empty");

const Service = require('../../models/Service');
const moment = require('moment')
const isEmpty = require('../../validation/is-empty')

const Bills = require('../../models/Bills');

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

  !isEmpty(req.query.company) ? filter = { 'company.name': new RegExp(escapeRegex(req.query.company), "gi") } : ''
  !isEmpty(req.query.reserve) ? filter = { ...filter, 'reserve': new RegExp(escapeRegex(req.query.reserve), "gi") } : ''
  !isEmpty(req.query.passenger) ? filter = { ...filter, 'passengers.name': new RegExp(escapeRegex(req.query.passenger), "gi") } : ''
  !isEmpty(req.query.requester) ? filter = { ...filter, 'requesters.name': new RegExp(escapeRegex(req.query.requester), "gi") } : ''
  !isEmpty(req.query.driver) ? filter = { ...filter, 'driver.name': new RegExp(escapeRegex(req.query.driver), "gi") } : ''
  !isEmpty(req.query.car) ? filter = { ...filter, 'car.name': new RegExp(escapeRegex(req.query.car), "gi") } : ''
  !isEmpty(req.query.hour) ? filter = { ...filter, 'hour': new RegExp(escapeRegex(req.query.hour), "gi") } : ''

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
		.sort('-os_date')
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
// @desc post service alter filed finalizad of Service and create 2 Bill, Receive type andpayment type
// @access Public
router.post('/finish/:id', (req, res) => {

	Service.findById(req.params.id, (err, doc) => {
		if (err) return res.status(400).json({error: "Erro na busca"});

		doc.finalized = true

		doc.save((err, updatedService) => {
			if (err) return res.status(400).json({error: "Erro ao salvar"})
				
			const VarBill = {}

			VarBill.service = doc._id
			VarBill.name = doc.company[0].name
			VarBill.requesters = doc.requesters
			VarBill.os_code = doc.id
			VarBill.passengers = doc.passengers
			VarBill.destinys = doc.destinys
			VarBill.os_date = doc.os_date
			VarBill.reserve = doc.reserve
			VarBill.car = doc.car
			VarBill.reserve = doc.reserve


			const newBillReceive = new Bill({...VarBill})

			newBillReceive.save((err, newBill) => {
				if (err) return res.status(400).json({error: "Erro ao Criar Receive"})

				VarBill.name = doc.driver[0].name 
				VarBill.type = "payment"

				const newBillPayment = new Bill({...VarBill})

				newBillPayment.save((err, newBill) => {
					if (err) return res.status(400).json({error: "Erro ao Criar Payment"})

						res.json({msg: "Recebimento e Pagamento criados com sucesso. Para consultá-los vá para o módulo de CONTAS"})
				})

			})
				

		})
	})
})

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

	req.body.company ? newService.company = req.body.company : '';
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