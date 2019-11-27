import express from 'express';

const router = express.Router();

router.post('/auth/create-user', (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

router.post('auth/signin', (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

module.exports = router;
