const express = require('express');
const router = express.Router();

const databaseController = require('../controllers/databaseController')

router.post('/seoItems', databaseController.addToSeo, (req, res) => {
  res.status(200).json({seoData: res.locals.seoData})
});

router.post('/filterSeoScores', databaseController.filterScoresAndUrls, (req, res) => {
  res.status(200).json({filterSeo: res.locals.filterSeoScores})
});

module.exports = router;

