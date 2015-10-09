//Require the Node4j module
var neo4j = require('node-neo4j');

//Create a db object. We will use this object to work on the DB.
db = new neo4j('http://neo4j:123456789@localhost:7474');

module.exports = db;