
const Service = require('../../models/Service');
const moment = require('moment')


async function getService(company, driver, passenger, car, reserve, hour, requester, date, filter){
		Service.find(
		{
			...filter,
			'company.name': company, 
			'driver.name': driver, 
			'passengers.name': passenger,
			'car.name': car,
			'reserve': reserve,
			'hour': hour,
			'requesters.name': requester,
			// os_date: { $gte: moment(date.start ), $lte: moment(date.end)} 
		})
		.then(doc => {
			console.log("sucesso")
			 return doc
		})
		.catch(err =>{
			return err
		})
}

function escapeRegex(text) {
	if(text){
  	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
	}
	else{
		return false
	}
}

module.exports = getService;