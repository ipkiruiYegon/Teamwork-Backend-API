const express = require('express');
const debug = require('debug')('teamwork-backend-api:debug');

const router = express.Router();
const Auth = require('../../auth/middleware/auth.js');
const { ErrorHandler } = require('../../auth/middleware/error');
const Helper = require('../../auth/helper.js');
const db = require('../../db/index.js');

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

// eslint-disable-next-line consistent-return
router.post('/articles', Auth.verifyToken, async (req, res) => {
  if (!req.body.title || !req.body.article || !req.body.userId) {
    return res.status(400).json({
      status: 'error',
      error: 'Incomplete request'
    });
  }
  try {
    /* check if authenticated(token) user is same as the user in request body */
    // eslint-disable-next-line radix
    if (parseInt(req.user.id) !== parseInt(req.body.userId)) {
      return res.status(401).json({
        status: 'error',
        error: 'Invalid user'
      });
    }
    const category = Helper.toTitleCase(req.body.category);
    const text = Helper.toTitleCase(req.body.article);
    const title = Helper.toTitleCase(req.body.title);
    const article = 'INSERT INTO articles(category, title, text, user_id) VALUES ($1, $2, $3, $4) returning *';
    const { rows } = await db.query(article, [
      category.trim(),
      title.trim(),
      text.trim(),
      req.user.id
    ]);
    if (!rows[0]) {
      return res.status(500).json({
        status: 'error',
        error: 'something went wrong while saving your request'
      });
    }
    res.status(201);
    res.json({
      status: 'success',
      data: {
        message: 'Article successfully posted',
        createdOn: rows[0].posted_date,
        title: rows[0].title,
        articleId: rows[0].id,
        userId: rows[0].user_id
      }
    });
  } catch (error) {
    debug(error);
    throw new ErrorHandler(
      500,
      'something went wrong while processing your request'
    );
  }
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
