const jwt = require('jsonwebtoken');
const config = require('config');
const debug = require('debug')('teamwork-backend-api:debug');
const db = require('../../db/index.js');
const { ErrorHandler } = require('../../auth/middleware/error');

const Auth = {
  // eslint-disable-next-line consistent-return
  async verifyToken(req, res, next) {
    try {
      if (!req.headers.authorization) {
        throw new ErrorHandler(401, 'Token is not provided');
      }
      const token = await req.headers.authorization.split(' ')[1];
      const secretWord = config.get('secret');
      const decoded = await jwt.verify(token, secretWord);
      const text = 'SELECT * FROM sys_users WHERE id = $1';
      const { rows } = await db.query(text, [decoded.userId]);
      if (!rows[0]) {
        throw new ErrorHandler(401, 'User not Found');
      }
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      debug(error);
      next(error);
    }
  },

  // eslint-disable-next-line consistent-return
  async verifyTokenAdmin(req, res, next) {
    try {
      if (!req.headers.authorization) {
        throw new ErrorHandler(401, 'Token is not provided');
      }

      const token = req.headers.authorization.split(' ')[1];
      const secretWord = config.get('secret');
      const decoded = await jwt.verify(token, secretWord);
      const text =
        'SELECT * FROM sys_users WHERE id = $1 and is_superuser = $2';
      const { rows } = await db.query(text, [decoded.userId, 'True']);
      if (!rows[0]) {
        throw new ErrorHandler(401, 'Only Admin can create system users');
      }
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      debug(error);
      next(error);
    }
  }
};

module.exports = Auth;
