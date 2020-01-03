const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const { handleError } = require('./auth/middleware/error');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use('/', routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  handleError(err, res);
});
// handle all not found errors here
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404);
  res.json({
    status: 'error',
    error: 'Route not found'
  });
});

module.exports = app;
