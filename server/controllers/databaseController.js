const db = require('../models/lighthouseModel.js');

const databaseController = {};

databaseController.seo = async (req, res, next) => {
  try {
    const {userId, score, audits, categoryGroups, domain} = req.body;
    const auditsJSON = JSON.stringify({audits});
    const categoryGroupsJSON = JSON.stringify({categoryGroups});
    //console.log('audits>'+ auditsJSON, 'category>'+categoryGroups)
    const values = [score, auditsJSON, userId, domain, categoryGroupsJSON];
    const queryString = 'INSERT INTO seo_table (score, audits, user_id, user_id_domain, category_groups) VALUES ($1, $2, $3, $4, $5) RETURNING *'; 
    //console.log('values> '+values)
    const data = await db.query(queryString, values);
    // console.log("data> "+data);
    // console.log('data.rows> '+data.rows[0]);

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