const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const lighthouseRouter = require('./routes/lighthouseRouter.js');
//const cookieRouter = require('./routes/cookies.js');
const databaseRouter = require('./routes/databaseRouter.js');

app.use(cookieParser());
app.use(express.json());
app.use(cors());


// app.use('/api', cookieRouter);
app.use('/api', lighthouseRouter);
app.use('/api', databaseRouter);

// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).json({"unknown": "route"}));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' }
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  return JSON.stringify(errorObj.status, errorObj.message);
});

app.listen(8080, () =>{
  console.log("server listening on port 8080")
});

module.exports = app;