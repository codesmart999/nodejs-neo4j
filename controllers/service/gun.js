var express = require('express')
	, router = express.Router()
	, guns = require('./../../models/guns')
	, async = require('async');

router.get('/', function(req, res){
	guns.all(req, res, function(err, node){
		if (err){
			console.log(err);
			res.json({status: 401});
		}else{
			console.log(node);
			res.json(node);
		}
	});
})

router.get('/customer/:customerID', function(req, res){
	guns.all(req, res, function(err, node){
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
	guns.get(req, res, function(err, node){
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
	var func_add_gun = function(callback){
		guns.add(req, res, callback);
 	};
 	var func_add_relationship = function(gun, callback){
 		guns.addRelationshipBetweenCustomer(req, res, gun, callback);
 	}
	
 	var call_stack = [func_add_gun, func_add_relationship];
	
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
	var func_edit_gun = function(callback){
		guns.edit(req, res, callback);
	}
	var func_del_relationships = function(node, callback){
		if (node && node.length > 0){
			res.gun = node[0];
			guns.delRelationships(req, res, callback);
		}else{
			callback("404", "Not Found");
		}
	}
	var func_add_relationship = function(result, callback){
 		guns.addRelationshipBetweenCustomer(req, res, res.gun, callback);
 	}
	
	var call_stack = [func_edit_gun, func_del_relationships, func_add_relationship];
 	
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

router.delete('/:uuid', function(req, res){
	guns.del(req, res, function(err, node){
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
	guns.del(req, res, function(err, node){
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