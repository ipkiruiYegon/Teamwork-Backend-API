const express = require('express');

const router = express.Router();
const Auth = require('../../auth/middleware/auth.js');

router.get('/users/:userId', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.get('/users', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.put('/users/:userId/type', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

module.exports = router;
