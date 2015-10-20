var express = require('express');
var router = express.Router();

router.all('/*', function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
});
router.use('/customer', require('./../controllers/service/customer'))
router.use('/module', require('./../controllers/service/module'))
router.use('/user', require('./../controllers/service/user'))
router.use('/login', require('./../controllers/service/login'))
router.use('/role', require('./../controllers/service/role'))

module.exports = router;
