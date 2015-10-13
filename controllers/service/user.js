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
	var func_get_user = function(callback){
		users.get(req, res, callback);
	};
	var func_get_module_accesses = function(node, callback){
		if (node.length > 0){
			res.user = node[0];
			users.getRelationships(req, res, node[0], callback);
		}else{
			callback(404, "Not found");
		}
	};
	
	async.waterfall(
			[func_get_user,
			 func_get_module_accesses],
			
			//if succeeds, result will hold information of the relationship.
			function(err, result){
				if (err){
					console.log(err);
					
					res.json({status: err, message: result});
				}else{
					console.log("Relationships:", result);
					var user = res.user;
					user.module = [];
					
					for (var i=0; i<result.length; i++)
						user.module[i] = result[i]._id;
					
					res.json({status: 0, node: user});
				}
				res.end();
			}
	);
})

router.post('/add', function(req, res){
	var func_add_user = function(callback){
 		users.add(req, res, callback);
 	};
 	var func_add_relationship = function(user, module_index, callback){
 		users.addRelationship(req, res, user, module_index, callback);
 	}
	
 	var call_stack = [func_add_user];
 	if (req.body.module && req.body.module.length > 0){
 		var module_length = req.body.module.length;
 		for (var i=0; i<module_length; i++)
 			call_stack[i + 1] = func_add_relationship;
 	}
	
 	async.waterfall(
			call_stack,
			
			//if succeeds, result will hold information of the relationship.
			function(err, result){
				if (err){
					console.log(err);
					
					res.json({status: err, message: result});
				}else{
					res.json({status: 0});
				}
				res.end();
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