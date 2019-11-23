import express from 'express';
import bodyParser from 'body-parser';

const routes = require('../src/app_routes/index');

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

app.use(routes);

// error handler for routes not found
app.get('*', (req, res) => {
  res.status(404);
  res.json({
    status: 'error',
    error: 'Route not found'
  });
});

// error handler for errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: 'error',
    error: 'An internal error occurred while processing your request'
  });
});

module.exports = app;
