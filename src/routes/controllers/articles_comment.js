const express = require('express');

const router = express.Router();
const Auth = require('../../auth/middleware/auth.js');

router.post('/articles/:articleId/comment', Auth.verifyToken, (req, res) => {
  res.status(201);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

module.exports = router;
