const express = require('express');
//const fs = require('fs');
const router = express.Router();
const trendsController = require('../controllers/trendsController')

router.post('/trends', trendsController)

module.exports = router