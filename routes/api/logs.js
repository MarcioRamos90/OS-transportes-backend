const express = require("express");
const router = express.Router();
const passport = require("passport");

const isEmpty = require("../../validation/is-empty");
const moment = require('moment')

const Service = require('../../models/Service');

// To create logs
const  createLog = require('../../middleware/push-logs-service-model')

const getDateTodayFormated = require('../../tools/date-formated')


// @route POST api/logs/service/:id
// @desc post service alter filed cancel of Service and create 2 Bill, Receive type andpayment type
// @access Public
router.post('/service/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
  
  Service.findOne({_id:req.params.id},(err, doc) => {
    if(!isEmpty(err)) return res.status(400).json({err: 'erro ao buscar serviço'})

    else{
      if(doc.printed === undefined || doc.printed === false || doc.printed === 'false'){
        Service.update({_id:req.params.id}, {$set: { 'printed': true}})
        .then(doc => Service.findOne({_id:req.params.id}))
        .then(doc => console.log(createLog(doc._id, { who:req.user.name,  what:'print', when:getDateTodayFormated()})))
        .then(doc => console.log(doc))
        .then(doc => res.json({msg:'criado log de primeira impresão'}))
        .catch(err => res.status(400).json({err: 'erro ao criar log'}))
      }else {
        return res.json({msg: 'já existe log'})
      }
    }
  })
})
// res.status(400).json(err)
module.exports = router