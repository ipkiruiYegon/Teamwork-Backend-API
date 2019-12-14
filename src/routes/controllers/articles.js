const express = require('express');

const router = express.Router();
const Auth = require('../../auth/middleware/auth.js');

router.get('/feed/articles', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.get('/articles', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.post('/articles', Auth.verifyToken, (req, res) => {
  res.status(201);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.get('/articles/:articleId', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.put('/articles/:articleId', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.delete('/articles/:articleId', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

module.exports = router;
