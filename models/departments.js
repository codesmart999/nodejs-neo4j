var db = require('./db-neo4j');
var uuid = require('node-uuid');
var crypto = require('crypto');

exports.all = function(req, res, cb){
	console.log("Trying to get all Departments");
	db.listAllLabels(function(err, node){
		console.log(node);
		db.readNodesWithLabel("Department", cb);
	})
	
	var query = "MATCH (department:Department), (customer:User)"
				+ " WHERE department.customerID = customer.customerID AND customer.valid=true AND customer.userRole = 'Customer'"
				+ " RETURN department.name, customer.fullName, department.departmentID";

	db.cypherQuery(query, cb);
}

exports.get = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	console.log("Trying to read Department:", req.params.uuid);
	db.readNodesWithLabelsAndProperties('Department', {departmentID: req.params.uuid}, cb);
}

exports.add = function(req, res, cb){
	console.log("Trying to add Department:", req.body)
	
	var _uuid = uuid.v4();
	
	db.insertNode({
		departmentID: _uuid,
		name: req.body.name,
		customerID: req.body.customerID,
		createdDTS: Date.now(),
	}, 'Department', cb);
}

exports.edit = function(req, res, cb){
	var data = {};
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	if (req.body.name)
		data.name = req.body.name;
	if (req.body.customerID)
		data.customerID = req.body.customerID;

	console.log("Trying to edit Department:" + req.params.uuid, data);
	db.updateNodesWithLabelsAndProperties('Department', {departmentID:req.params.uuid}, data, cb);
}

exports.del = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	var query = "MATCH (n {departmentID: '" + req.params.uuid + "'})-[r]-() DELETE n,r";
	console.log("Trying to delete Department:", req.params.uuid);

	db.cypherQuery(query, function(err, node){
		if (err || !node)
			return cb("401", "Failed in deleting Department");
		else{
			query = "MATCH (n {departmentID: '" + req.params.uuid + "'}) DELETE n";
			db.cypherQuery(query, cb);
			/*db.deleteNodesWithLabelsAndProperties('Department', {departmentID:req.params.uuid}, function(err, node){
				if (err)
					return cb(err, "Failed in deleting Department");
				if (node === true){
					return cb(err, node);
				}else {
					return cb("401", "Failed in deleting Department due to existing relationships");
				}
			});*/
		}
	});
}