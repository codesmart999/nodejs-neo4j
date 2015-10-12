var db = require('./db-neo4j');
var uuid = require('node-uuid');
var crypto = require('crypto');
var async = require('async')

exports.all = function(req, res, cb){
	console.log("Trying to get all Users");
	db.listAllLabels(function(err, node){
		console.log(node);
		db.readNodesWithLabel("User", cb);
	})
}

exports.get = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	console.log("Trying to read User:", req.params.uuid);
	db.readNodesWithLabelsAndProperties('User', {userID: req.params.uuid}, cb);
}

exports.add = function(req, res, cb){
	console.log("Trying to add User:", req.body)
	
	var _uuid = uuid.v1();
	var digest = crypto.createHash('md5').update(req.body.password).digest("hex");
	
	db.insertNode({
		userID: _uuid,
		userName: req.body.userName,
		password: digest,
		fullName: req.body.fullName,
		country: req.body.country,
		customerID: req.body.customerID
	}, 'User', cb);
}

exports.edit = function(req, res, cb){
	var data = {};
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	if (req.body.userName)
		data.userName = req.body.userName;
	if (req.body.password){
		var digest = crypto.createHash('md5').update(req.body.password).digest("hex");
		data.password = digest;
	}
	if (req.body.fullName)
		data.fullName = req.body.fullName;
	if (req.body.country)
		data.country = req.body.country;
	if (req.body.customerID)
		data.customerID = req.body.customerID;
	
	console.log("Trying to edit User:" + req.params.uuid, data);
	db.updateNodesWithLabelsAndProperties('User', {userID:req.params.uuid}, data, cb);
}

exports.del = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	console.log("Trying to delete User:", req.params.uuid);
	db.deleteNodesWithLabelsAndProperties('User', {userID:req.params.uuid}, function(err, node){
		if (err)
			return cb(err, "Failed in deleting User");
		return cb(err, node);
	});
}

/**
 * Login API
 */
exports.login = function(req, res, cb){
	console.log("Trying to login:", req.body);
	
	var digest = crypto.createHash('md5').update(req.body.password).digest("hex");
	
	db.readNodesWithLabelsAndProperties(
			['User', 'Customer'],
			{userName:req.body.userName},
			function(err, node){
				if (err)
					return cb(400, "Failed in Login");
				if (node.length > 0){
					return cb(0, node);
				}
				
				db.readNodesWithLabelsAndProperties(
						['User', 'Customer'],
						{userName:req.body.userName},
						function(err, node){
							console.log("Result_err:", err);
							console.log("Result_node:", node);
							if (err)
								return cb(400, "Failed in Login");
							if (node.length > 0){
								return cb(401, "Incorrect Password");
							}else{
								return cb(402, "Invalid Username");
							}
						}
				);
			}
	);
}