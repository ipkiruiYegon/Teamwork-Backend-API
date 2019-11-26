import express from 'express';
const app = express();
const router = express.Router();

// eslint-disable-next-line import/no-unresolved
const users = require('../../src/routes/controllers/users');
const articles = require('../../src/routes/controllers/articles');
const gifs = require('../../src/routes/controllers/gifs');
const gif_comments = require('../../src/routes/controllers/gifs_comments');
const article_comments = require('../../src/routes/controllers/articles_comment');

router.use('/api/v1', users);
router.use('/api/v1', articles);
router.use('/api/v1', gifs);
router.use('/api/v1', gif_comments);
router.use('/api/v1', article_comments);

module.exports = router;
