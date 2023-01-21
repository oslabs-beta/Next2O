const express = require('express');
const router = express.Router();

router.post('/seo/update', (req, res) => {
  return res.status(200).json(res.locals.seo)
});



module.exports = router;