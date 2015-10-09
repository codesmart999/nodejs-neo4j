var express = require('express');
var router = express.Router();

router.use('/customer', require('./../controllers/service/customer'))

module.exports = router;
