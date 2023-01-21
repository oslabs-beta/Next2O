const db = require('../models/lighthouseModel.js');

const databaseController = {};

databaseController.seo = async (req, res, next) => {
  try {
    // const {userId} = req.cookies;
    const {userId, score, audits, categoryGroups} = req.body;
    const values = [userId, score, audits, categoryGroups,];
    const queryString = `INSERT INTO seo_table (user_id, score, audits, category_groups) VALUES ($1, $2, $3, $4)`; 
    const data = await db.query(queryString, values);
    res.locals.seo = data.rows[0];
    console.log(res.locals.seo)
    return next();
  } 
  catch(err) {
    return next({
      log: 'Express error handler caught error in databaseController.seo',
      message: { err: 'databaseController.seo: check server log for details' } 
    });
  }
};