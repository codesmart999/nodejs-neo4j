var db = require('./db-neo4j');
var uuid = require('node-uuid');
var crypto = require('crypto');

exports.all = function(req, res, cb){
	var query = "";
	if (req.params && req.params.customerID){
		console.log("Trying to get Zones of Customer:" + req.params.customerID);
		query = "MATCH (customer:User {userID:'" + req.params.customerID + "'})-[r1]-(region:Region)-[r2]-(zone:Zone)"
			+ " RETURN zone.name, zone.manager, zone.email, zone.phone, zone.zipcode, zone.state, zone.country, zone.fax";
	}else{
		console.log("Trying to get all Zones");
		query = "MATCH (zone:Zone)"
		+ " RETURN zone.name, zone.manager, zone.email, zone.phone, zone.zipcode, zone.state, zone.country, zone.fax";
	}

	db.cypherQuery(query, function(err, node){
		if (err)
			return cb(err, node);
		else{
			var result = [];
			for (var i=0; i<node.data.length; i++){
				var item = {
						name: node.data[i][0],
						manager: node.data[i][1],
						email: node.data[i][2],
						phone: node.data[i][3],
						zipcode: node.data[i][4],
						state: node.data[i][5],
						country: node.data[i][6],
						fax: node.data[i][7]
				};
				result[result.length] = item;
			}
			return cb(err, result);
		}
	});
}

exports.get = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	console.log("Trying to read Zone:", req.params.uuid);
	db.readNodesWithLabelsAndProperties('Zone', {zoneID: req.params.uuid}, cb);
}

exports.add = function(req, res, cb){
	console.log("Trying to add Zone:", req.body)
	
	var _uuid = uuid.v4();
	
	db.insertNode({
		zoneID: _uuid,
		name: req.body.name,
		regionID: req.body.regionID,
		zonetypeID: req.body.zonetypeID,
		manager: req.body.manager,
		email: req.body.email,
		phone: req.body.phone,
		address1: req.body.address1,
		address2: req.body.address2,
		zipcode: req.body.zipcode,
		state: req.body.state,
		country: req.body.country,
		fax: req.body.fax,
	}, 'Zone', function(err, node){
		if (err)
			return cb("401", "Zone Name already exists!");
		else
			cb(err, node);
	});
}

exports.edit = function(req, res, cb){
	var data = {};
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	
	if (req.body.name)
		data.name = req.body.name;
	if (req.body.manager)
		data.manager = req.body.manager;
	if (req.body.regionID)
		data.regionID = req.body.regionID;
	if (req.body.zonetypeID)
		data.zonetypeID = req.body.zonetypeID;
	if (req.body.email)
		data.email = req.body.email;
	if (req.body.phone)
		data.phone = req.body.phone;
	if (req.body.address1)
		data.address1 = req.body.address1;
	if (req.body.address2)
		data.address2 = req.body.address2;
	if (req.body.zipcode)
		data.zipcode = req.body.zipcode;
	if (req.body.state)
		data.state = req.body.state;
	if (req.body.country)
		data.country = req.body.country;
	if (req.body.fax)
		data.fax = req.body.fax;

	console.log("Trying to edit Zone:" + req.params.uuid, data);
	db.updateNodesWithLabelsAndProperties('Zone', {zoneID:req.params.uuid}, data, cb);
}

exports.del = function(req, res, cb){
	if (!req.params.uuid){
		return cb("404", "UUID Missing");
	}
	var query = "MATCH (n {zoneID: '" + req.params.uuid + "'})-[r]-() DELETE n,r";
	console.log("Trying to delete Zone:", req.params.uuid);

	db.cypherQuery(query, function(err, node){
		if (err || !node)
			return cb("401", "Failed in deleting Zone");
		else{
			query = "MATCH (n {zoneID: '" + req.params.uuid + "'}) DELETE n";
			db.cypherQuery(query, cb);
		}
	});
}

/**
 * Add Relationship between a customer and zones.
 * 
 * Parameters
 * @req: req.body.module contains an array of module _ids
 * @res:
 * @zone: Newly Inserted Zone
 * @cb: callback function
 */
exports.addRelationshipBetweenRegion = function(req, res, zone, cb){
	console.log("Trying to create relationships FROM Region:", req.body.regionID);
	console.log("Trying to create relationships TO Zone:", zone.zoneID);

	var query = "MATCH (region:Region {regionID:'" + req.body.regionID + "'}),"
		+ "(zone:Zone {zoneID:'" + zone.zoneID + "'})"
		+ " CREATE (region)-[r:Region_Zone]->(zone) RETURN r";

	db.cypherQuery(query, cb);
}

exports.delRelationships = function(req, res, cb){
	var query = "MATCH (zone {zoneID: '" + req.params.uuid + "'})-[r]-() DELETE r";
	console.log("Trying to delete Zone relationships. Zone ID:", req.params.uuid);
	db.cypherQuery(query, cb);
}