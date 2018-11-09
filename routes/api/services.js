const express = require("express");
const router = express.Router();

const isEmpyt = require("../../validation/is-empty");
const moment = require('moment')
const isEmpty = require('../../validation/is-empty')

const Service = require('../../models/Service');
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

  // filtros em geral
  !isEmpty(req.query.company) ? filter = { 'company.name': new RegExp(escapeRegex(req.query.company), "gi") } : ''
  !isEmpty(req.query.custCenter) ? filter = { 'custCenter': new RegExp(escapeRegex(req.query.custCenter), "gi") } : ''
  !isEmpty(req.query.id) ? filter = { 'id': new RegExp(escapeRegex(req.query.id), "gi") } : ''
  !isEmpty(req.query.reserve) ? filter = { ...filter, 'reserve': new RegExp(escapeRegex(req.query.reserve), "gi") } : ''
  !isEmpty(req.query.passenger) ? filter = { ...filter, 'passengers.name': new RegExp(escapeRegex(req.query.passenger), "gi") } : ''
  !isEmpty(req.query.requester) ? filter = { ...filter, 'requesters.name': new RegExp(escapeRegex(req.query.requester), "gi") } : ''
  !isEmpty(req.query.driver) ? filter = { ...filter, 'driver.name': new RegExp(escapeRegex(req.query.driver), "gi") } : ''
  !isEmpty(req.query.car) ? filter = { ...filter, 'car.name': new RegExp(escapeRegex(req.query.car), "gi") } : ''
  !isEmpty(req.query.hour) ? filter = { ...filter, 'hour': new RegExp(escapeRegex(req.query.hour), "gi") } : ''

  // Os canceladas ou não canceladas 
  req.query.status === "true" ? (filter.status = true) : ''
  req.query.status === "false" ? (filter.status = false) : ''

  // Os finalizadas, abertas ou todas
  req.query.finalized === 'true' ? filter.finalized = req.query.finalized : '';
  req.query.finalized === 'false' ? filter.finalized = req.query.finalized : '';
  req.query.finalized === '' ? "" : '';

	const date = {}
	req.query.start ? date.start = req.query.start : date.start = "2000-01-01"
	req.query.end ? date.end = req.query.end : date.end = "2030-01-01"

	Service.find(
		{
			...filter,
			os_date: { $gte: moment(date.start ), $lte: moment(date.end)} 
		})
		.sort('os_date')
		.sort('hour')
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

	req.body.company ? newService.company = req.body.company : '';
	req.body.passenger ? newService.passengers = req.body.passenger  : '';
	newService.os_date = req.body.date || Date.now();
	req.body.requester ? newService.requesters = req.body.requester : '';
	req.body.reserve ? newService.reserve = req.body.reserve : '';
	req.body.driver ? newService.driver = req.body.driver : '';
	req.body.car ? newService.car = req.body.car : '';
	req.body.custCenter ? newService.custCenter = req.body.custCenter : '';
	req.body.destiny ? newService.destinys = req.body.destiny : '';
	req.body.hour ? newService.hour = req.body.hour : '';
	req.body.observation ? newService.observation = req.body.observation : '';
	req.body.status == "" ? (newService.status = true) : '';
  req.body.status === "false" ? (newService.status = false) : '';

	newService.save()
		.then(doc => {
			res.json(doc)
		})
		.catch(err => {
			res.status(400).json(err)
		});
})


// @route POST api/services/
// @desc post service alter filed finalizad of Service and create 2 Bill, Receive type andpayment type
// @access Public

router.post('/finish/:id', (req, res) => {

	Service.findById(req.params.id,  (err, doc) => {
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
			VarBill.driver = doc.driver[0].name
			VarBill.custCenter = doc.custCenter

			const newBillReceive = new Bill({...VarBill})

			newBillReceive.save((err, newBill) => {
				if (err) return res.status(400).json({error: "Erro ao Criar Receive"})

				VarBill.name = doc.driver[0].name
				VarBill.type = "payment"
				VarBill.company = doc.company[0].name

				const newBillPayment = new Bill({...VarBill})

				newBillPayment.save((err, newBill) => {
					if (err) return res.status(400).json({error: "Erro ao Criar Payment"})

						res.json({msg: "Recebimento e Pagamento criados com sucesso. Para consultá-los vá para o módulo de CONTAS"})
				})
			})
		})
	})
})


// @route PUT api/services/cancel
// @desc put cancel service
// @access Public
router.put('/cancel', (req, res) => {
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
	req.body.message ? editService.message = req.body.message : ''; // Add Message
  editService.status = false //Cancel OS
  req.body.custCenter ? editService.custCenter = req.body.custCenter : '';
  
  editService.observation = req.body.observation
  editService.hour = req.body.hour
  editService.reserve = req.body.reserve

	Service.findByIdAndUpdate(id, editService, (err, doc) => {
    if (!isEmpty(err))
      return res
        .status(400)
        .json({error: 'erro no cancelamento'});

    if(!req.body.createBill)
    	return res.json({ msg: "Cancelamento realizado com sucesso!" });

    if(req.body.createBill){
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
			VarBill.custCenter = doc.custCenter
			VarBill.value = req.body.valuetoReceive || ""

			const newBillReceive = new Bill({...VarBill})
			
			newBillReceive.save((err, newBill) => {
				if (!isEmpty(err)) return res.status(400).json({error: "Erro ao Criar Receive"})

				VarBill.name = doc.driver[0].name
				VarBill.type = "payment"
				VarBill.company = doc.company[0].name
				VarBill.value = req.body.valuetoPay  || ""

				const newBillPayment = new Bill({...VarBill})

				newBillPayment.save((err, newBill) => {
					if (!isEmpty(err)) return res.status(400).json({error: "Erro ao Criar Payment"})

					return res.json({msg: "Recebimento e Pagamento criados com sucesso. Para consultá-los vá para o módulo de CONTAS"})
				});
    	});
  	}
  });
})


// @route PUT api/services/edit
// @desc put edit service
// @access Public
router.put('/edit', (req, res) => {
	let passengerEdit = false, receiveEdit = false, paymentEdit = false 

	let { 
		id, 
		company, passenger, date, requester, driver, car, destiny, status, custCenter,
		observation, hour, reserve
	 } = req.body;
	
	const editService = {};

	company ? editService.company = company : '';
	passenger ? editService.passengers = passenger  : '';
	date ? editService.os_date = date : '';
	requester ? editService.requesters = requester : '';
	
	driver ? editService.driver = driver : '';
	car ? editService.car = car : '';
	destiny ? editService.destinys = destiny : '';
	status == "" ? (editService.status = true) : '';
  status === "false" ? (editService.status = false) : '';
  custCenter ? editService.custCenter = custCenter : '';

  editService.observation = observation
  editService.hour = hour
  editService.reserve = reserve  
  
  Service.findByIdAndUpdate(id, editService, {new: true}, async(err, doc) => {
    if (!isEmpty(err))
      return res
        .status(400)
        .json({error: 'erro na alteração'});

      passengerEdit = true
    await Bill.find({os_code: doc.id}, async(err, docBill) => {
    	if (!isEmpty(err))
      return res
        .status(400)
        .json({error: 'erro na procura dereceive'});

      let receiveBill = {
      	_id,
      	status, type, checked, service, name, requesters, os_code, passengers, destinys, os_date, 
      	reserve, car, driver, value, observation
      } = docBill.filter((bill) => bill.type === 'receive')[0] || {}
			
			receiveBill.name = doc.company[0].name
			receiveBill.requesters = doc.requesters
			receiveBill.os_code = doc.id
			receiveBill.passengers = doc.passengers
			receiveBill.destinys = doc.destinys
			receiveBill.os_date = doc.os_date
			receiveBill.reserve = doc.reserve
			receiveBill.car = doc.car
			receiveBill.custCenter = doc.custCenter
			receiveBill.driver = doc.driver[0].name

			await Bill.findByIdAndUpdate(receiveBill._id, receiveBill, (err, doc) =>{
				if (!isEmpty(err)){
      		return res
		        .status(400)
		        .json({error: 'erro na alteração'});
				}

      	receiveEdit = true;
			})

			let paymentBill = {
				_id,
      	status, type, checked, service, name, requesters, os_code, passengers, destinys, os_date, 
      	reserve, car, driver, value, company, observation
      } = docBill.filter((bill) => bill.type === 'payment')[0] || {}
			
			paymentBill.name = doc.driver[0].name
			paymentBill.requesters = doc.requesters
			paymentBill.os_code = doc.id
			paymentBill.passengers = doc.passengers
			paymentBill.destinys = doc.destinys
			paymentBill.os_date = doc.os_date
			paymentBill.reserve = doc.reserve
			paymentBill.car = doc.car
			paymentBill.reserve = doc.reserve
			paymentBill.custCenter = doc.custCenter
			receiveBill.company = doc.company[0].name

	    await Bill.findByIdAndUpdate(paymentBill._id, paymentBill, (err, doc) =>{
					if (!isEmpty(err)){
	      		return res
			        .status(400)
			        .json({error: 'erro na alteração'});
					}
	      	paymentEdit = true;
			})
    })

    return res.json({
    	passengerEdit,
    	receiveEdit,
    	paymentEdit
    })
  	
  });
})

module.exports = router