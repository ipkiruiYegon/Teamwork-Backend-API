const express = require('express');
const debug = require('debug')('teamwork-backend-api:debug');

const router = express.Router();
const Auth = require('../../auth/middleware/auth.js');
const { ErrorHandler } = require('../../auth/middleware/error');
const Helper = require('../../auth/helper.js');
const db = require('../../db/index.js');

router.get('/articles', Auth.verifyToken, async (req, res) => {
  try {
    const sql =
      'SELECT articles.id as id, articles.category as category, articles.title as title, articles.text as article,  articles.posted_date as createdOn, articles.article_flagged as flagged, articles.user_id AS authorId,count(articles_comments.id) as comments FROM articles LEFT JOIN articles_comments ON articles.id = articles_comments.article GROUP BY articles.id ORDER BY posted_date DESC';
    const { rows } = await db.query(sql);
    debug(rows);
    if (rows) {
      res.status(200);
      res.json({
        status: 'success',
        data: rows
      });
    }
  } catch (error) {
    debug(error);
    throw new ErrorHandler(
      500,
      'something went wrong while processing your request'
    );
  }
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
    const article =
      'INSERT INTO articles(category, title, text, user_id) VALUES ($1, $2, $3, $4) returning *';
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

router.get('/articles/:articleId', Auth.verifyToken, async (req, res) => {
  if (req.params) {
    try {
      const articleId = Number(req.params.articleId);
      if (Number.isInteger(articleId)) {
        const sql = 'Select * from articles where id=$1';
        const { rows } = await db.query(sql, [articleId]);
        if (!rows[0]) {
          return res.status(404).json({
            status: 'error',
            message: 'Article not found'
          });
        }
        const sql2 =
          'select id as commentId,user_id as authorId,text as comment from articles_comments where article=$1 ORDER BY comment_date desc';
        const comments = await db.query(sql2, [articleId]);
        res.status(200);
        res.json({
          status: 'success',
          data: {
            id: rows[0].id,
            createdOn: rows[0].posted_date,
            category: rows[0].category,
            title: rows[0].title,
            article: rows[0].text,
            url: rows[0].gifurl,
            userId: rows[0].user_id,
            comments: comments.rows
          }
        });
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Incomplete request'
        });
      }
    } catch (error) {
      debug(error);
      throw new ErrorHandler(
        500,
        'something went wrong while processing your request'
      );
    }
  } else {
    return res.status(400).json({
      status: 'error',
      message: 'Incomplete request'
    });
  }
});

router.delete('/articles/:articleId', Auth.verifyToken, async (req, res) => {
  if (req.params) {
    try {
      const articleId = Number(req.params.articleId);
      if (Number.isInteger(articleId)) {
        const sql = 'Select * from articles where id=$1';
        const { rows } = await db.query(sql, [articleId]);
        if (!rows[0]) {
          return res.status(404).json({
            status: 'error',
            message: 'Article not found'
          });
        }
        if (req.user.id === rows[0].user_id) {
          const delG = 'Delete from articles where id=$1 RETURNING *';
          const deletedArticle = await db.query(delG, [rows[0].id]);
          if (!deletedArticle.rows[0]) {
            return res.status(404).json({
              status: 'error',
              message: 'Article not found'
            });
          }
          res.status(200);
          res.json({
            status: 'success',
            data: {
              message: 'Article successfully deleted',
              articleId: deletedArticle.rows[0].id
            }
          });
        } else {
          /* check if user is admin and Article has been flagged as inappropriate */
          const sql2 =
            'SELECT * FROM sys_users WHERE id = $1 and is_superuser = $2';
          const admin = await db.query(sql2, [req.user.id, 'True']);
          if (!admin.rows[0]) {
            return res.status(401).json({
              status: 'error',
              message: 'You are not allowed to do this'
            });
          }
          const sql3 =
            'Select * from articles where id=$1 and article_flagged =$2';
          const flagged = await db.query(sql3, [articleId, 'True']);
          if (!flagged.rows[0]) {
            return res.status(401).json({
              status: 'error',
              message: 'You are not allowed to do this'
            });
          }
          /* admin can now delete flagged articles- inappropriate */
          const delG2 = 'Delete from articles where id=$1 RETURNING *';
          const dArticle = await db.query(delG2, [rows[0].id]);
          if (!dArticle.rows[0]) {
            return res.status(404).json({
              status: 'error',
              message: 'Article not found'
            });
          }
          res.status(200);
          res.json({
            status: 'success',
            data: {
              message: 'Article flagged inappropriate successfully deleted',
              articleId: dArticle.rows[0].id
            }
          });
        }
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Incomplete request'
        });
      }
    } catch (error) {
      debug(error);
      throw new ErrorHandler(
        500,
        'something went wrong while processing your request'
      );
    }
  } else {
    return res.status(400).json({
      status: 'error',
      message: 'Incomplete request'
    });
  }
});

router.patch('/articles/:articleId', Auth.verifyToken, async (req, res) => {
  if (req.params) {
    if (!req.body.title || !req.body.article || !req.body.userId) {
      return res.status(400).json({
        status: 'error',
        error: 'Incomplete request'
      });
    }
    try {
      const articleId = Number(req.params.articleId);
      if (Number.isInteger(articleId)) {
        const sql = 'Select * from articles where id=$1';
        const { rows } = await db.query(sql, [articleId]);
        if (!rows[0]) {
          return res.status(404).json({
            status: 'error',
            message: 'Article not found'
          });
        }
        if (req.user.id === rows[0].user_id) {
          const text = Helper.toTitleCase(req.body.article);
          const title = Helper.toTitleCase(req.body.title);
          const update =
            'Update articles set title=$1,text=$2 where id=$3 RETURNING *';
          const updateArticle = await db.query(update, [
            title,
            text,
            rows[0].id
          ]);
          if (!updateArticle.rows[0]) {
            return res.status(404).json({
              status: 'error',
              message: 'Article with that Id not found'
            });
          }
          res.status(201);
          res.json({
            status: 'success',
            data: {
              message: 'Article successfully updated',
              articleId: updateArticle.rows[0].id,
              title: updateArticle.rows[0].title,
              article: updateArticle.rows[0].text,
              authorId: updateArticle.rows[0].user_id
            }
          });
        }
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Incomplete request'
        });
      }
    } catch (error) {
      debug(error);
      throw new ErrorHandler(
        500,
        'something went wrong while processing your request'
      );
    }
  } else {
    return res.status(400).json({
      status: 'error',
      message: 'Incomplete request'
    });
  }
});

router.patch('/articles/:articleId/flag', Auth.verifyToken, async (req, res) => {
  debug(req.params);
  if (req.params && req.body.reason) {
    try {
      const articleId = Number(req.params.articleId);
      if (Number.isInteger(articleId)) {
        const sql = 'Select * from articles where id=$1';
        const { rows } = await db.query(sql, [articleId]);
        if (!rows[0]) {
          return res.status(404).json({
            status: 'error',
            message: 'Article not found'
          });
        }
        const reason = Helper.toTitleCase(req.body.reason);
        const flagged = await db.query(
          'Select * from articles where article_flagged=$1 and id=$2',
          ['True', articleId]
        );
        if (!flagged.rows[0]) {
          const articleFlag = await db.query(
            'UPDATE articles SET article_flagged=$1 where id=$2 returning *',
            ['True', articleId]
          );
          if (!articleFlag.rows[0]) {
            return res.status(500).json({
              status: 'error',
              message: 'something went wrong while processing your request'
            });
          }
        }
        const flag = await db.query(
          'INSERT INTO articles_flags(article, reason, user_id) VALUES ($1, $2, $3) returning *',
          [articleId, reason, req.user.id]
        );
        if (!flag.rows[0]) {
          return res.status(500).json({
            status: 'error',
            message: 'something went wrong while processing your request'
          });
        }
        res.status(200);
        res.json({
          status: 'success',
          data: {
            message: 'gif successfully flagged as inapproriate',
            articleId,
            flagId: flag.rows[0].id,
            reason: flag.rows[0].reason,
            userId: flag.rows[0].user_id
          }
        });
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Incomplete request'
        });
      }
    } catch (error) {
      debug(error);
      throw new ErrorHandler(
        500,
        'something went wrong while processing your request'
      );
    }
  } else {
    return res.status(400).json({
      status: 'error',
      message: 'Incomplete request'
    });
  }
});

module.exports = router;
