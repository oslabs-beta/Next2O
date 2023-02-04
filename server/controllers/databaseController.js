const db = require('../models/lighthouseModel.js');

const databaseController = {};

databaseController.addToSeo = async (req, res, next) => {
  try {
    const {userId, url, audits, categories, categoryGroups} = req.body;
    
    const values = [userId, url, audits, categories, categoryGroups];
    const queryString = 'INSERT INTO seo (user_id, url, audits, categories, category_groups) VALUES ($1, $2, $3, $4, $5) RETURNING *'; 
    console.log('values> '+values)
    const data = await db.query(queryString, values);
     console.log("data> "+data);
     console.log('data.rows> '+data.rows[0]);

    res.locals.seoData = data.rows[0];
    // res.locals.userId = userId;
    // res.locals.categoryGroups = categoryGroups;
    // res.locals.domain = domain;
    // res.locals.audits = audits;
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

module.exports = databaseController;