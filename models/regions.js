var db = require('./db-neo4j');
var uuid = require('node-uuid');
var crypto = require('crypto');

exports.all = function(req, res, cb){
	console.log("Trying to get all Regions");
	db.listAllLabels(function(err, node){
		console.log(node);
		db.readNodesWithLabel("Region", cb);
	})
}

exports.get = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	console.log("Trying to read Region:", req.params.uuid);
	db.readNodesWithLabelsAndProperties('Region', {regionID: req.params.uuid}, cb);
}

exports.add = function(req, res, cb){
	console.log("Trying to add Region:", req.body)
	
	var _uuid = uuid.v4();
	
	db.insertNode({
		regionID: _uuid,
		name: req.body.name,
		link: req.body.link,
		icon: req.body.icon,
	}, 'Region', cb);
}

exports.edit = function(req, res, cb){
	var data = {};
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	if (req.body.name)
		data.name = req.body.name;
	if (req.body.link)
		data.link = req.body.link;
	if (req.body.icon)
		data.icon = req.body.icon;

	console.log("Trying to edit Region:" + req.params.uuid, data);
	db.updateNodesWithLabelsAndProperties('Region', {regionID:req.params.uuid}, data, cb);
}

exports.del = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	var query = "MATCH (n {regionID: '" + req.params.uuid + "'})-[r]-() DELETE n,r";
	console.log("Trying to delete Region:", req.params.uuid);

	db.cypherQuery(query, function(err, node){
		if (err || !node)
			return cb("401", "Failed in deleting Region");
		else{
			query = "MATCH (n {regionID: '" + req.params.uuid + "'}) DELETE n";
			db.cypherQuery(query, cb);
			/*db.deleteNodesWithLabelsAndProperties('Region', {regionID:req.params.uuid}, function(err, node){
				if (err)
					return cb(err, "Failed in deleting Region");
				if (node === true){
					return cb(err, node);
				}else {
					return cb("401", "Failed in deleting Region due to existing relationships");
				}
			});*/
		}
	});
}