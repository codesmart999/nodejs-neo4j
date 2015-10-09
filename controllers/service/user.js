var express = require('express')
	, router = express.Router()
	, users = require('./../../models/users')

router.get('/', function(req, res){
	users.all(req, res, function(err, node){
		if (err){
			console.log(err);
			res.json({status: 401});
		}else{
			console.log(node);
			res.json(node);
		}
	});
})

router.get('/:id', function(req, res){
	users.get(req, res, function(err, node){
		if (err){
			console.log(err);
			
			res.json({status: err, message: node});
		}else{
			res.json({status: 0, node: node});
		}
	});
})

router.post('/add', function(req, res){
	users.add(req, res, function(err, node){
		if (err){
			console.log(err);
			
			res.json({status: err, message: node});
		}else{
			res.json({status: 0});
		}
	});
})

router.post('/edit/:id', function(req, res){
	users.edit(req, res, function(err, node){
		if (err){
			console.log(err);
			
			res.json({status: err, message: node});
		}else{
			res.json({status: 0});
		}
	});
})

router.delete('/:id', function(req, res){
	users.del(req, res, function(err, node){
		if (err){
			console.log(err);
			
			res.json({status: err, message: node});
		}else{
			//node deleted
			res.json({status: 0})
		}
	})
})

router.post('/del/:id', function(req, res){
	users.del(req, res, function(err, node){
		if (err){
			console.log(err);
			
			res.json({status: err, message: node});
		}else{
			//node deleted
			res.json({status: 0})
		}
	})
})

module.exports = router;