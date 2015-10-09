var db = require('./db-neo4j');

exports.all = function(req, res, cb){
	console.log("Trying to get all Users");
	db.insertNode({
		fullName: "Tuguldur Sumiya",
		address: "SBD 3rd, apt 41-53",
		userName: "tuguldur",
		password: "123456789"
	}, 'User', cb);
//	db.listAllLabels(function(err, node){
//		console.log(node);
//		db.readNodesWithLabel("User", cb);
//	})
}

exports.get = function(req, res, cb){
	if (!req.params.id){
		return cb("404", "UserId Missing");
	}
	
	console.log("Trying to read User:", req.params.id);
	db.readNode(req.params.id, cb);
}

exports.add = function(req, res, cb){
	console.log("Trying to add User:", req.body)
	db.insertNode({
		fullName: req.body.fullName,
		address: req.body.address,
		userName: req.body.userName,
		password: req.body.password
	}, 'User', cb);
}

exports.edit = function(req, res, cb){
	var data = {};
	if (!req.params.id){
		return cb("404", "UserId Missing");
	}
	
	if (req.body.fullName)
		data.fullName = req.body.fullName;
	if (req.body.address)
		data.address = req.body.address;
	if (req.body.userName)
		data.userName = req.body.userName;
	if (req.body.password)
		data.password = req.body.password;
	
	console.log("Trying to edit User:" + req.params.id, data);
	db.updateNode(req.params.id, data, cb);
}

exports.del = function(req, res, cb){
	if (!req.params.id){
		return cb("404", "UserId Missing");
	}
	
	console.log("Trying to delete User:", req.params.id);
	db.deleteNode(req.params.id, function(err, node){
		if (err)
			return cb(err, "Failed in deleting User");
		if (node === true){
			return cb(err, node);
		}else {
			return cb("401", "Failed in deleting User due to existing relationships");
		}
	});
}