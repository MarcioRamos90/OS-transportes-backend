const express = require("express");
const router = express.Router();
const isEmpty = require('../../validation/is-empty')
const moment = require('moment')
// const isEmpyt = require("../../validation/is-empty");

const Bills = require('../../models/Bills');
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


// @route GET api/bills/
// @desc get all or filter bills
// @access Public
router.get("/", async (req, res)  =>  {
  filter = {};

  req.query.code ? filter.id =  req.query.code : '';


  !isEmpty(req.query.service) ? filter.service = new RegExp(escapeRegex(req.query.service), "gi") : ''
  !isEmpty(req.query.os_code) ? filter.os_code = req.query.os_code : ""
  !isEmpty(req.query.name) ? filter.name = new RegExp(escapeRegex(req.query.name), "gi") : ''
  !isEmpty(req.query.os_date) ? filter.os_date = new RegExp(escapeRegex(req.query.os_date), "gi") : ''
  !isEmpty(req.query.status) ? filter.status = new RegExp(escapeRegex(req.query.status), "gi") : ''
  !isEmpty(req.query.custCente) ? filter.custCente = new RegExp(escapeRegex(req.query.custCente), "gi") : ''
  !isEmpty(req.query.type) ? filter.type = new RegExp(escapeRegex(req.query.type), "gi") : ''
  
  const date = {}
  req.query.start ? date.start = req.query.start : date.start = "2000-01-01"
  req.query.end ? date.end = req.query.end : date.end = "2030-01-01"

  Bills.find({...filter, os_date: { $gte: moment(date.start ), $lte: moment(date.end)} }).then(doc => {
    res.json(doc)
  }).catch(err => {
    res.status(400).json(err)
  })

});

// @route GET api/bills/:id
// @desc get bill by id
// @access Public
router.get("/:id", async (req, res)  =>  {

  const id = req.params.id
  
  console.log(Bills.schema.path('status').enumValues[0])
  console.log(Bills.schema.path('status').enumValues[1])
  console.log(Bills.schema.path('type').enumValues[0])
  console.log(Bills.schema.path('type').enumValues[1])

  Bills.findById(id)
  .sort('os_date')
  .sort('os_code')
  .then(doc => {
    res.json(doc)
  }).catch(err => {
    res.status(400).json(err)
  })

});


// @route POST api/bilsss/
// @desc post new service
// @access Public
router.post('/', (req, res) => {

	const newbilss = new Bills({})

	!isEmpty(req.body.service) ? newbilss.service = req.body.service : '';
  !isEmpty(req.body.os_code) ? newbilss.os_code = req.body.os_code  : '';
  !isEmpty(req.body.name) ? newbilss.name = req.body.name  : '';
  !isEmpty(req.body.os_date) ? newbilss.os_date = req.body.os_date  : '';
  !isEmpty(req.body.value) ? newbilss.value = req.body.value  : '';
  !isEmpty(req.body.status) ? newbilss.status = req.body.status  : '';
	!isEmpty(req.body.type) ? newbilss.type = req.body.type  : '';

	newbilss.save()
		.then(doc => {
			res.json(doc)
		})
		.catch(err => {
			res.status(400).json(err)
		});
})

// @route PUT api/bilsss/edit
// @desc update bills
// @access Public
router.put("/edit", (req, res) => {
  const id = req.body.id;

  const billsEdit = {}
  
  !isEmpty(req.body.service) ? billsEdit.service = req.body.service : '';
  !isEmpty(req.body.os_code) ? billsEdit.os_code = req.body.os_code  : '';
  !isEmpty(req.body.reserve) ? billsEdit.reserve = req.body.reserve  : '';
  !isEmpty(req.body.name) ? billsEdit.name = req.body.name  : '';
  !isEmpty(req.body.os_date) ? billsEdit.os_date = req.body.os_date  : '';
  !isEmpty(req.body.value) ? billsEdit.value = String(req.body.value).replace(',', '.')  : '';
  !isEmpty(req.body.status) ? billsEdit.status = req.body.status : '';
  !isEmpty(req.body.observation) ? billsEdit.observation = req.body.observation : '';
  !isEmpty(req.body.type) ? billsEdit.type = req.body.type  : '';

  Bills.findByIdAndUpdate(id, billsEdit , (err, doc) => {
    if (err)
      return res
        .observation(400)
        .json({ doc });

    return res.json(doc);
  });
});


module.exports = router;