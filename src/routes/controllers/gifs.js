const express = require('express');

const router = express.Router();
const Auth = require('../../auth/middleware/auth.js');

router.get('/feed/gifs', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.get('/gifs', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.post('/gifs', Auth.verifyToken, (req, res) => {
  res.status(201);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.get('/gifs/:gifId', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.delete('/gifs/:gifId', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

module.exports = router;
