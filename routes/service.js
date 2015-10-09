var express = require('express');
var router = express.Router();

router.use('/customer', require('./../controllers/service/customer'))
router.use('/module', require('./../controllers/service/module'))
router.use('/user', require('./../controllers/service/user'))
router.use('/login', require('./../controllers/service/login'))

module.exports = router;
