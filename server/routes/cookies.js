const express = require('express');

const router = express.Router();
const cookieController = require('../controllers/cookieController');

// router.post('/setCookies', cookieController.setCookies, (req, res) =>{
//   return res.status(200).json({message: 'set cookies succesfully'})
// });
router.get('/cookie', cookieController.checkForCookie, (req, res) => {
  // route logic here
  res.status(200).send(req.cookies.userId)
});

module.exports = router;