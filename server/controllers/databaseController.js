const db = require('../models/lighthouseModel.js');

const databaseController = {};

databaseController.addToSeo = async (req, res, next) => {
  try {
    const {userId, url, audits, seoScore, performanceScore, accessibilityScore} = req.body;
    
    const values = [userId, url, audits, seoScore, performanceScore, accessibilityScore];
    const queryString = 'INSERT INTO seo (user_id, url, audits, seo_score, performance_score, accessibility_score ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'; 
    const data = await db.query(queryString, values);

    res.locals.seoData = data.rows[0];
   
    return next();
  } 
  catch(err) {
    console.log(err)
    console.log(err.message);
    console.log(err.stack);

    return next({
      log: 'Express error handler caught error in databaseController.seo',
      message: { err: 'databaseController.seo: check server log for details' } 
    });
  }
};


databaseController.filterScoresAndUrls = async (req, res, next) => {
  try {
    const {userId, url} = req.body;
    const values = [userId, url]
    const queryString = `SELECT seo_score, performance_score, accessibility_score, date
      FROM seo WHERE user_id = $1 AND url = $2`;
    const data = await db.query(queryString, values)
    res.locals.filterSeoScores = data.rows;
    return next();

  } catch(err) {
      console.log(err)
      console.log(err.message);
      console.log(err.stack);
  
      return next({
        log: 'Express error handler caught error in databaseController.filterScoresAndUrls',
        message: { err: 'databaseController.filterScoresAndUrls: check server log for details' } 
      });
  }

}

module.exports = databaseController;