import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

module.exports = router;
