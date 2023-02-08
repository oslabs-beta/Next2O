const express = require('express');
const router = express.Router();
const {sendMail} = require('../controllers/emailController')

router.post('/share', sendMail)

module.exports = router;