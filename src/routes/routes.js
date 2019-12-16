const express = require('express');

const router = express.Router();

// eslint-disable-next-line import/no-unresolved
const users = require('../../src/routes/controllers/users');
const articles = require('../../src/routes/controllers/articles');
const gifs = require('../../src/routes/controllers/gifs');
const gifComments = require('../../src/routes/controllers/gifs_comments');
const articleComments = require('../../src/routes/controllers/articles_comment');
const authRoutes = require('../../src/routes/controllers/auth_routes');

router.use('/api/v1', users);
router.use('/api/v1', articles);
router.use('/api/v1', gifs);
router.use('/api/v1', gifComments);
router.use('/api/v1', articleComments);
router.use('/api/v1', authRoutes);

module.exports = router;
