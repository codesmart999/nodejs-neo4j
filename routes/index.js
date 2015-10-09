var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
	res.render('index', {title: 'Neo4j-Node-App'})
})

module.exports = router