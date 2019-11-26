import express from 'express';

const router = express.Router();

router.get('/feed/gifs', (req, res) => {
    res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.get('/gifs', (req, res) => {
    res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.post('/gifs', (req, res) => {
    res.status(201)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.get('/gifs/:gifId', (req, res) => {
    res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.delete('/gifs/:gifId', (req, res) => {
    res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});


module.exports = router;