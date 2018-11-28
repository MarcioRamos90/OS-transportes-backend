const Service = require('../models/Service');

module.exports = (id, log) => {
	
	return Service.findById(id)
		.then((doc) => {

			doc.log.push(log);
			return doc.save()
		})
		.then(docF =>  docF)
		.catch(err => err)
}