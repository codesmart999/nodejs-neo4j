var express = require('express')
	, router = express.Router()
	, users = require('./../../models/users')

router.post('/', function(req, res){
	users.login(req, res, function(err, node){
		if (err){
			console.log(err);
			
			res.json({status: err, message: node});
		}else{
			res.json({status: 0, node: node[0]});
		}
	});
})

module.exports = router;