import express from 'express';

const router = express.Router();

router.post('/articles/:articleId/comment', (req, res) => {
    res.status(201)    
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
});

module.exports = router;