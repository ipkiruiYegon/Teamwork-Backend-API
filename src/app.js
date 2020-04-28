/* eslint-disable func-names */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const { resolve } = require('path');
const routes = require('./routes/routes');
const { handleError } = require('./auth/middleware/error');
const { cloudinaryConfig } = require('../cloudinaryConfig.js');

const app = express();

const allowedOrigins = ['http://localhost:3000'];
app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
//   );
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');
//   next();
// });

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// app.use(express.static(resolve(__dirname, 'src')));

app.use('*', cloudinaryConfig);

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
