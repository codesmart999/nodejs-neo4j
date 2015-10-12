var express = require('express')
	, router = express.Router()
	, users = require('./../../models/users')
	, async = require('async');

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

router.get('/:uuid', function(req, res){
	users.get(req, res, function(err, node){
		if (err){
			console.log(err);
			
			res.json({status: err, message: node});
		}else if (node.length > 0){
			res.json({status: 0, node: node[0]});
		}else{
			res.json({status: 404, node: "Not found"});
		}
	});
})

router.post('/add', function(req, res){
	async.waterfall(
			[
			 	function(callback){
			 		users.add(req, res, callback);
			 	},function(node, callback){
			 		console.log("Next:", node);
			 		callback(null, node);
			 	}
			 ],
			function(err, node){
				if (err){
					console.log(err);
					
					res.json({status: err, message: node});
				}else{
					res.json({status: 0});
				}
			}
	);
})

router.post('/edit/:uuid', function(req, res){
	users.edit(req, res, function(err, node){
		if (err){
			console.log(err);
			
			res.json({status: err, message: node});
		}else{
			res.json({status: 0});
		}
	});
})

router.delete('/:uuid', function(req, res){
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

router.get('/del/:uuid', function(req, res){
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