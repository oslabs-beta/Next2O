const express = require('express');
const app = express();
const cors = require('cors');
//const cookieParser = require('cookie-parser');

const lighthouseRouter = require('./routes/lighthouseRouter.js');
const databaseRouter = require('./routes/databaseRouter.js');

//app.use(cookieParser());
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors());

app.use('/api', lighthouseRouter);
app.use('/api', databaseRouter);


app.use((err, req, res, next) => {
  const defaultErr = {
    log: `${err} Express error handler caught unknown middleware error`,
    status: 500,
    message: { err: 'An error occurred' }
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  return JSON.stringify(errorObj.status, errorObj.message);
});

app.listen(8080, () => {
  console.log("server listening on port 8080")
});

module.exports = app;