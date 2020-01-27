const express = require('express');
const debug = require('debug')('teamwork-backend-api:debug');

const router = express.Router();
const Auth = require('../../auth/middleware/auth.js');
const { multerUploads, dataUri } = require('../../auth/middleware/multer.js');
const { uploader } = require('../../../cloudinaryConfig.js');
const { ErrorHandler } = require('../../auth/middleware/error');
const db = require('../../db/index.js');
const Helper = require('../../auth/helper.js');

router.get('/feed', Auth.verifyToken, async (req, res) => {
  const feed = `SELECT articles.id as id, articles.category as category, articles.title as title, articles.text as article_url, 
    articles.posted_date as createdOn, articles.article_flagged as flagged, articles.user_id AS authorId,
    'Article' as type, count(articles_comments.id) as comments FROM articles 
    LEFT JOIN articles_comments ON articles.id = articles_comments.article GROUP BY articles.id UNION 
    SELECT gifs.id as id, gifs.category as category, gifs.category as title, gifs.gifurl as url, gifs.posted_date as createdOn, 
    gifs.gif_flagged as flagged, gifs.user_id AS authorId, 'Gif' as type, count(gif_comments.id) as comments 
    FROM gifs LEFT JOIN gif_comments ON gifs.id = gif_comments.gif GROUP BY gifs.id ORDER BY createdOn DESC`;
  const feeds = await db.query(feed);
  res.status(200);
  res.json({
    status: 'success',
    data: feeds.rows
  });
});

router.get('/gifs', Auth.verifyToken, async (req, res) => {
  const sql = 'SELECT gifs.id as id, gifs.category as title, gifs.gifurl as url, gifs.text as text, gifs.posted_date as createdOn, gifs.gif_flagged as flagged, gifs.user_id AS authorId,count(gif_comments.id) as comments FROM gifs LEFT JOIN gif_comments ON gifs.id = gif_comments.gif GROUP BY gifs.id ORDER BY posted_date DESC';
  const { rows } = await db.query(sql);
  debug(rows);
  if (rows) {
    res.status(200);
    res.json({
      status: 'success',
      data: rows
    });
  }
});

// eslint-disable-next-line consistent-return
router.post('/gifs', Auth.verifyToken, multerUploads, async (req, res) => {
  /* check if request has the file and body containing the Gif Title
  and some brief text in regards to the GIF posted */
  if (req.file && req.body.category && req.body.text) {
    try {
      /* check if authenticated(token) user is same as the user in request body */
      // eslint-disable-next-line radix
      if (parseInt(req.user.id) !== parseInt(req.body.userId)) {
        return res.status(401).json({
          status: 'error',
          error: 'Invalid user'
        });
      }
      // debug(req.body);
      const file = dataUri(req).content;
      const results = await uploader.upload(file);
      debug(results);
      if (results) {
        const category = Helper.toTitleCase(req.body.category);
        const text = Helper.toTitleCase(req.body.text);
        // debug(results);
        const gif = 'INSERT INTO gifs(category, gifurl, text, user_id) VALUES ($1, $2, $3, $4) returning *';
        const { rows } = await db.query(gif, [
          category.trim(),
          results.url,
          text.trim(),
          req.user.id
        ]);
        if (!rows[0]) {
          return res.status(500).json({
            status: 'error',
            error: 'something went wrong while saving your request'
          });
        }
        // success and saved to db
        res.status(201);
        res.json({
          status: 'success',
          data: {
            message: 'GIF image successfully posted',
            createdOn: rows[0].posted_date,
            title: rows[0].category,
            gifId: rows[0].id,
            imageUrl: rows[0].gifurl,
            userId: rows[0].user_id
          }
        });
      } else {
        return res.status(500).json({
          status: 'error',
          error: 'something went wrong while processing your request'
        });
        // throw new ErrorHandler(
        //   500,
        //   'someting went wrong while processing your request'
        // );
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
      error: 'Incomplete request'
    });
  }
});

router.get('/gifs/:gifId', Auth.verifyToken, async (req, res) => {
  if (req.params) {
    try {
      const gifId = Number(req.params.gifId);
      if (Number.isInteger(gifId)) {
        const sql = 'Select * from gifs where id=$1';
        const { rows } = await db.query(sql, [gifId]);
        if (!rows[0]) {
          return res.status(404).json({
            status: 'error',
            message: 'Gif not found'
          });
        }
        const sql2 = 'select id as commentId,user_id as authorId,text as comment from gif_comments where gif=$1 ORDER BY comment_date desc';
        const comments = await db.query(sql2, [gifId]);
        res.status(200);
        res.json({
          status: 'success',
          data: {
            id: rows[0].id,
            createdOn: rows[0].posted_date,
            title: rows[0].category,
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

router.delete('/gifs/:gifId', Auth.verifyToken, async (req, res) => {
  debug(req.params);
  if (req.params) {
    try {
      const gifId = Number(req.params.gifId);
      if (Number.isInteger(gifId)) {
        const sql = 'Select * from gifs where id=$1';
        const { rows } = await db.query(sql, [gifId]);
        if (!rows[0]) {
          return res.status(404).json({
            status: 'error',
            message: 'Gif not found'
          });
        }
        if (req.user.id === rows[0].user_id) {
          const pid = rows[0].gifurl
            .split('/')
            .reverse()[0]
            .split('.')[0];
          const { result } = await uploader.destroy(pid);
          const delG = 'Delete from gifs where id=$1 RETURNING *';
          if (result !== 'ok') {
            /* delete in db any way */
            const deletedGif = await db.query(delG, [rows[0].id]);
            if (!deletedGif.rows[0]) {
              return res.status(404).json({
                status: 'error',
                message: 'Gif not found'
              });
            }
            return res.status(200).json({
              status: 'success',
              data: { message: 'gif post successfully deleted' }
            });
          }
          const deletedG = await db.query(delG, [rows[0].id]);
          if (!deletedG.rows[0]) {
            return res.status(404).json({
              status: 'error',
              message: 'Gif not found'
            });
          }
          res.status(200);
          res.json({
            status: 'success',
            data: { message: 'gif post successfully deleted' }
          });
        } else {
          /* check if user is admin and GIF has been flagged as inappropriate */
          const sql2 = 'SELECT * FROM sys_users WHERE id = $1 and is_superuser = $2';
          const admin = await db.query(sql2, [req.user.id, 'True']);
          if (!admin.rows[0]) {
            return res.status(401).json({
              status: 'error',
              message: 'You are not allowed to do this'
            });
          }
          const sql3 = 'Select * from gifs where id=$1 and gif_flagged =$2';
          const flagged = await db.query(sql3, [gifId, 'True']);
          if (!flagged.rows[0]) {
            return res.status(401).json({
              status: 'error',
              message: 'You are not allowed to do this'
            });
          }
          /* admin can now delete flagged gifs- inappropriate */
          const pid2 = flagged.rows[0].gifurl
            .split('/')
            .reverse()[0]
            .split('.')[0];
          const { result } = await uploader.destroy(pid2);
          const delG2 = 'Delete from gifs where id=$1 RETURNING *';
          if (result !== 'ok') {
            /* delete in db any way */
            const deletedGif = await db.query(delG2, [flagged.rows[0]]);
            if (!deletedGif.rows[0]) {
              return res.status(404).json({
                status: 'error',
                message: 'Gif not found'
              });
            }
            return res.status(200).json({
              status: 'success',
              data: { message: 'gif post flagged successfully deleted' }
            });
          }
          const deletedG = await db.query(delG2, [rows[0].id]);
          if (!deletedG.rows[0]) {
            return res.status(404).json({
              status: 'error',
              message: 'Gif not found'
            });
          }
          res.status(200);
          res.json({
            status: 'success',
            data: { message: 'gif post flagged successfully deleted' }
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

module.exports = router;
