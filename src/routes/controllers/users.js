import express from 'express';

const router = express.Router();

router.get('/users/:userId', (req, res) => {
  res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.get('/users', (req, res) => {
  res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.put('/users/:userId/type', (req, res) => {
  res.status(200)
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});


module.exports = router;
