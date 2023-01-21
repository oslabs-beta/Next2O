const {Pool} = require('pg');

const PG_URI = 'postgres://qxvpkcrp:jQZHCl3NiO0wGOPiXIaVkGJBgnanQc24@kashin.db.elephantsql.com/qxvpkcrp';

const pool = new Pool({
  connectionString: PG_URI,
  // user: "postgres",
  // password: 'jQZHCl3NiO0wGOPiXIaVkGJBgnanQc24',
  // host: "localhost",
  // port: 5432,
  // database: "seo"
});

module.exports = {
  query: (text, params, callback)=> {
    console.log('executed query', text);
    return pool.query(text, params, callback)
  }
};



//var conString = "INSERT_YOUR_POSTGRES_URL_HERE" //Can be found in the Details page
// var client = new Pool.Client(PG_URI);
// client.connect(function(err) {
//   if(err) {
//     return console.error('could not connect to postgres', err);
//   }
//   client.query('SELECT NOW() AS "theTime"', function(err, result) {
//     if(err) {
//       return console.error('error running query', err);
//     }
//     console.log("sfewf");
//     // >> output: 2018-08-23T14:02:57.117Z
//     client.end();
//   });
// });