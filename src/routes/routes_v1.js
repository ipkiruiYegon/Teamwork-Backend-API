const express = require('express');

const router = express.Router();

const users = require('../routes/controllers/users');
const articles = require('../routes/controllers/articles');
const gifs = require('../routes/controllers/gifs');
const gifComments = require('../routes/controllers/gifs_comments');
const articleComments = require('../routes/controllers/articles_comment');
const authRoutes = require('../routes/controllers/auth_login');

router.use('/api/v1', users);
router.use('/api/v1', articles);
router.use('/api/v1', gifs);
router.use('/api/v1', gifComments);
router.use('/api/v1', articleComments);
router.use('/api/v1', authRoutes);

module.exports = router;
