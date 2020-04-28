const express = require('express');

const router = express.Router();
const debug = require('debug')('teamwork-backend-api:debug');
const Auth = require('../../auth/middleware/auth.js');
const db = require('../../db/index.js');
const { ErrorHandler } = require('../../auth/middleware/error');
const Helper = require('../../auth/helper.js');

router.get('/users/:userId', Auth.verifyToken, async (req, res) => {
  if (req.params) {
    debug(req.params);
    try {
      // eslint-disable-next-line radix
      const user = parseInt(Helper.decryptData(req.params.userId));
      debug(user, req.user.id);
      const text = 'SELECT * FROM sys_users WHERE id = $1';
      const { rows } = await db.query(text, [user]);
      if (!rows[0]) {
        throw new ErrorHandler(401, 'invalid User session');
      }
      res.status(200);
      res.json({
        status: 'success',
        data: rows,
      });
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
      message: 'Incomplete request',
    });
  }
});

router.get('/users', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1',
  });
});

router.put('/users/:userId/type', Auth.verifyToken, (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1',
  });
});

module.exports = router;
