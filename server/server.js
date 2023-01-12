const express = require('express');
const app = express();
const cors = require('cors');
const lighthouseRouter = require('./routes/lighthouseApi.js');

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded());
// app.use(bodyParser.json());


app.use('/api', lighthouseRouter);
// app.use('/api', lighthouseRouter);
app.get('/', (req, res) => {
  console.log(req.headers)
  res.send('sdsds')
});

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

