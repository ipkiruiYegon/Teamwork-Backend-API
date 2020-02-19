const jwt = require('jsonwebtoken');
const config = require('config');
const debug = require('debug')('teamwork-backend-api:debug');
const db = require('../../db/index.js');
const { ErrorHandler } = require('../../auth/middleware/error');

const Auth = {
  // eslint-disable-next-line consistent-return
  async verifyToken(req, res, next) {
    try {
      if (!req.headers.token && !req.headers.authorization) {
        throw new ErrorHandler(401, 'Token is not provided');
      }
      // const token = await req.headers.authorization.split(' ')[1];
      if (req.headers.token) {
        const token = await req.headers.token;
        const secretWord = config.get('secret');
        const decoded = await jwt.verify(token, secretWord);
        const user = decoded.userId;
        // debug(user);
        const text = 'SELECT * FROM sys_users WHERE id = $1';
        const { rows } = await db.query(text, [user]);
        if (!rows[0]) {
          throw new ErrorHandler(401, 'User not Found');
        }
        if (req.body.userId && req.body.userId !== user) {
          throw new ErrorHandler(401, 'invalid user token');
        } else {
          req.user = { id: user };
          next();
        }
      } else if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const secretWord = config.get('secret');
        const decoded = await jwt.verify(token, secretWord);
        const user = decoded.userId;
        // debug(user);
        const text = 'SELECT * FROM sys_users WHERE id = $1';
        const { rows } = await db.query(text, [user]);
        if (!rows[0]) {
          throw new ErrorHandler(401, 'User not Found');
        }
        debug(req.body.userId, req.body.userId !== user);
        if (req.body.userId && req.body.userId !== user) {
          throw new ErrorHandler(401, 'invalid user token');
        } else {
          req.user = { id: user };
          next();
        }
      }
    } catch (error) {
      debug(error);
      next(error);
    }
  },

  // eslint-disable-next-line consistent-return
  async verifyTokenAdmin(req, res, next) {
    try {
      if (!req.headers.token && !req.headers.authorization) {
        throw new ErrorHandler(401, 'Token is not provided');
      }
      if (req.headers.token) {
        const token = await req.headers.token;
        const secretWord = config.get('secret');
        const decoded = await jwt.verify(token, secretWord);
        const user = decoded.userId;
        const text =
          'SELECT * FROM sys_users WHERE id = $1 and is_superuser = $2';
        const { rows } = await db.query(text, [user, 'True']);
        if (!rows[0]) {
          throw new ErrorHandler(401, 'Only Admin can create system users');
        }
        if (req.body.userId && req.body.userId !== user) {
          throw new ErrorHandler(401, 'invalid user token');
        }
        req.user = { id: user };
        next();
      } else if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const secretWord = config.get('secret');
        const decoded = await jwt.verify(token, secretWord);
        const user = decoded.userId;
        debug(decoded);
        debug(user);
        const text =
          'SELECT * FROM sys_users WHERE id = $1 and is_superuser = $2';
        const { rows } = await db.query(text, [user, 'True']);
        if (!rows[0]) {
          throw new ErrorHandler(401, 'Only Admin can create system users');
        }
        if (req.body.userId && req.body.userId !== user) {
          throw new ErrorHandler(401, 'invalid user token');
        }
        req.user = { id: user };
        next();
      }
    } catch (error) {
      debug(error);
      next(error);
    }
  }
};

module.exports = Auth;
