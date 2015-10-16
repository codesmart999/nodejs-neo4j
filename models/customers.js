var db = require('./db-neo4j');
var uuid = require('node-uuid');
var crypto = require('crypto');

exports.all = function(req, res, cb){
//	var id = uuid.v4();
	
//	var digest = crypto.createHash('md5').update("123456789").digest("hex");
//	
//	db.insertNode({
//		customerID: id,
//		fullName: req.body.fullName,
//		address: req.body.address,
//		userName: req.body.userName,
//		password: digest
//	}, 'Customer', cb);
	console.log("Trying to get all Customers");
	db.listAllLabels(function(err, node){
		console.log(node);
		//db.readNodesWithLabel("Customer", cb);
		db.readNodesWithLabelsAndProperties('Customer', {userRole: "Customer", deleted: false}, cb);
	})
}

exports.get = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	console.log("Trying to read Customer:", req.params.uuid);
	db.readNodesWithLabelsAndProperties('Customer', {customerID: req.params.uuid, userRole: "Customer", deleted: false}, cb);
}

exports.add = function(req, res, cb){
	console.log("Trying to add Customer:", req.body)
	
	var _uuid = uuid.v4();
	var digest = crypto.createHash('md5').update(req.body.password).digest("hex");
	
	db.insertNode({
		customerID: _uuid,
		fullName: req.body.fullName,
		address: req.body.address,
		userName: req.body.userName,
		company: req.body.company,
		password: digest,
		userRole: 'Customer',
		deleted: false
	}, 'User', function(err, node){
		if (err)
			cb(err, "Company already registered", 0);
		else
			cb(err, node, 0);
	});
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
	if (req.body.password){
		var digest = crypto.createHash('md5').update(req.body.password).digest("hex");
		data.password = digest;
	}
	if (req.body.company)
		data.company = req.body.company;
	
	console.log("Trying to edit Customer:" + req.params.uuid, data);
	db.updateNodesWithLabelsAndProperties('User', {customerID:req.params.uuid}, data, cb);
}

exports.del = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	console.log("Trying to delete Customer:", req.params.uuid);
	db.updateNodesWithLabelsAndProperties('User', {customerID:req.params.uuid}, {deleted: true}, cb);
	
	/*
	var query = "MATCH (n {customerID: '" + req.params.uuid + "'})-[r]-() DELETE n,r";
	db.cypherQuery(query, function(err, node){
		if (err){
			return cb(err, node);
		}else{
			query = "MATCH (n {customerID: '" + req.params.uuid + "'}) DELETE n";
			db.cypherQuery(query, cb);
		}
	});
	*/
}

/**
 * Add Relationship between a customer and modules.
 * 
 * Parameters
 * @req: req.body.module contains an array of module _ids
 * @res:
 * @node: Newly Inserted Customer
 * @cb: callback function
 */
exports.addRelationship = function(req, res, customer, module_index, cb){
	console.log("Trying to create relationships FROM Customer:", customer);
	console.log("Trying to create relationships TO Module with _id:", req.body.module[module_index]);
	
	db.insertRelationship(
			customer._id,
			req.body.module[module_index],
			'Customer_Module',
			{access: 'yes'},
			function(err, relationship){
				if (err)
					return cb(err, "Failed to Create Relationship");
				
				cb(err, customer, module_index + 1);
			}
	);
}

exports.getRelationships = function(req, res, customer, cb){
	console.log("Trying to read relationships FROM Customer:", customer);
	
	db.readRelationshipsOfNode(
			customer._id,
			{
				type: ['Customer_Module'],
				direction: 'out',
			},
			cb
	);
}

exports.delRelationships = function(req, res, customer, cb){
	var query = "MATCH (customer {customerID: '" + customer.customerID + "'})-[r]-() DELETE r";
	console.log("Trying to delete Module Accesses:", customer);
	db.cypherQuery(query, function(err, result){
		cb(err, customer, 0);
	});
}