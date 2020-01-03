const express = require('express');

const router = express.Router();
const Auth = require('../../auth/middleware/auth.js');
const multer = require('../../auth/middleware/multer.js');

router.get('/feed/gifs', Auth.verifyToken, async (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.get('/gifs', Auth.verifyToken, async (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.post('/gifs', Auth.verifyToken, multer, async (req, res) => {
  console.log('req.file :', req.file);
  res.status(201);
  res.status(201);
  res.json({
    status: 'success',
    data: {
      message: 'GIF image successfully posted',
      createdOn: 'DateTime',
      title: 'rows[0].id',
      imageUrl: 'http'
    }
  });
});

router.get('/gifs/:gifId', Auth.verifyToken, async (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.delete('/gifs/:gifId', Auth.verifyToken, async (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

module.exports = router;
