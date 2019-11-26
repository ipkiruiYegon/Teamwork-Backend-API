import express from 'express';

const router = express.Router();

router.get('/feed/articles', (req, res) => {
    res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.get('/articles', (req, res) => {
    res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.post('/articles', (req, res) => {
    res.status(201)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.get('/articles/:articleId', (req, res) => {
    res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.put('/articles/:articleId', (req, res) => {
    res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.delete('/articles/:articleId', (req, res) => {
    res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});



module.exports = router;