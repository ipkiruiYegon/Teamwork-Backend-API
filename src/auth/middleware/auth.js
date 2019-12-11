const jwt = require('jsonwebtoken');
const config = require('config');
const db = require('../../db/index.js');

const Auth = {
  // eslint-disable-next-line consistent-return
  async verifyToken(req, res, next) {
    if (!req.headers.authorization) {
      return res
        .status(400)
        .send({ status: 'error', error: 'Token is not provided' });
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secretWord = config.get('secret');
      const decoded = await jwt.verify(token, secretWord);
      const text = 'SELECT * FROM sys_users WHERE id = $1';
      const { rows } = await db.query(text, [decoded.userId]);
      if (!rows[0]) {
        return res.status(400).send({
          status: 'error',
          error: 'The userid token you provided is invalid'
        });
      }
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      return res.status(500).send({
        status: 'error',
        error
      });
    }
  },

  // eslint-disable-next-line consistent-return
  async verifyTokenAdmin(req, res, next) {
    if (!req.headers.authorization) {
      return res
        .status(400)
        .send({ status: 'error', error: 'Token is not provided' });
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secretWord = config.get('secret');
      const decoded = await jwt.verify(token, secretWord);
      const text =        'SELECT * FROM sys_users WHERE id = $1 and is_superuser = $2';
      const { rows } = await db.query(text, [decoded.userId, 'True']);
      if (!rows[0]) {
        return res.status(400).send({
          status: 'error',
          error: 'Only Admin can create system users'
        });
      }
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      return res.status(500).send({
        status: 'error',
        error
      });
    }
  }
};

module.exports = Auth;
