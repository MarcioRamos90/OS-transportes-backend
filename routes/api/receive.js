const express = require("express");
const router = express.Router();

// const isEmpyt = require("../../validation/is-empty");

const Receive = require('../../models/Receive');
// const moment = require('moment')

// To reset the id
// Service.counterReset('id', function(err){})

function escapeRegex(text) {
  if(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
  }
  else{
    return false
  }
}

const getService = require('../functions/getServices')

// @route GET api/services/
// @desc get all or filter services
// @access Public
router.get("/", async (req, res)  =>  {
  filter = {};

  req.query.code ? filter.id =  req.query.code : '';
  
  const company = /[\w. ]+/
  const reserve = /[\w. ]+/
  const passenger = /[\w. ]+/
  const requester = /[\w. ]+/
  const driver = /[\w. ]+/
  const car = /[\w. ]+/
  const hour = /[\w. ]+/

  req.query.company ? company = new RegExp(escapeRegex(req.query.company), "gi") : ''
  req.query.reserve ? reserve = new RegExp(escapeRegex(req.query.reserve), "gi") : ''
  req.query.passenger ? passenger = new RegExp(escapeRegex(req.query.passenger), "gi") : ''
  req.query.requester ? requester = new RegExp(escapeRegex(req.query.requester), "gi") : ''
  req.query.car ? car = new RegExp(escapeRegex(req.query.car), "gi") : ''
  req.query.driver ? driver = new RegExp(escapeRegex(req.query.driver), "gi") : ''
  req.query.hour ? hour = new RegExp(escapeRegex(req.query.hour), "gi") : ''

  req.query.status === "true"
    ? (filter.status = true)
    : ''
   req.query.status === "false"
    ? (filter.status = false)
    : ''

  const date = {}
  req.query.start ? date.start = req.query.start : date.start = "2000-01-01"
  req.query.end ? date.end = req.query.end : date.end = "2030-01-01"

  res.json({msg: 'ola'})


  try{
    const serv = await getService(company, driver, passenger, car, reserve, hour, requester, date, filter)  
    
  }catch (error) {
    console.log(errro)
  }
  
  console.log(serv)
  

});


// @route POST api/receives/
// @desc post new service
// @access Public
router.post('/', (req, res) => {

	const newReceive = new Receive({})

	req.body.service ? newReceive.service = req.body.service : '';
	req.body.value ? newReceive.value = req.body.value  : '';

	newReceive.save()
		.then(doc => {
			res.json(doc)
		})
		.catch(err => {
			res.status(400).json(err)
		});
})

// @route PUT api/receives/edit
// @desc update Receive
// @access Public
router.put("/edit", (req, res) => {
  const id = req.body.id;

  const receiveEdit = {
    value: req.body.value
  };

  console.log(req.body.value * 3)

  Receive.findByIdAndUpdate(id, receiveEdit , (err, doc) => {
    if (err)
      return res
        .status(400)
        .json({ doc });

    return res.json(doc);
  });
});

module.exports = router;