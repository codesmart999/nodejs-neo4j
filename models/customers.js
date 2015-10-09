var db = require('./db-neo4j');
var uuid = require('node-uuid');

exports.all = function(req, res, cb){
	var id = uuid.v1();
//	db.insertNode({
//		customerID: id,
//		fullName: req.body.fullName,
//		address: req.body.address,
//		userName: req.body.userName,
//		password: req.body.password
//	}, 'Customer', cb);
	console.log("Trying to get all Customers");
	db.listAllLabels(function(err, node){
		console.log(node);
		db.readNodesWithLabel("Customer", cb);
	})
}

exports.get = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	console.log("Trying to read Customer:", req.params.uuid);
	db.readNodesWithLabelsAndProperties('Customer', {customerID: req.params.uuid}, cb);
}

exports.add = function(req, res, cb){
	console.log("Trying to add Customer:", req.body)
	var _uuid = uuid.v1();
	db.insertNode({
		customerID: _uuid,
		fullName: req.body.fullName,
		address: req.body.address,
		userName: req.body.userName,
		password: req.body.password
	}, 'Customer', cb);
}

exports.edit = function(req, res, cb){
	var data = {};
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	if (req.body.fullName)
		data.fullName = req.body.fullName;
	if (req.body.address)
		data.address = req.body.address;
	if (req.body.userName)
		data.userName = req.body.userName;
	if (req.body.password)
		data.password = req.body.password;
	
	console.log("Trying to edit Customer:" + req.params.uuid, data);
	db.updateNodesWithLabelsAndProperties('Customer', {customerID:req.params.uuid}, data, cb);
}

exports.del = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	console.log("Trying to delete Customer:", req.params.uuid);
	db.deleteNodesWithLabelsAndProperties('Customer', {customerID:req.params.uuid}, function(err, node){
		if (err)
			return cb(err, "Failed in deleting Customer");
		if (node === true){
			return cb(err, node);
		}else {
			return cb("401", "Failed in deleting Customer due to existing relationships");
		}
	});
}