const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('config');
const moment = require('moment');
const debug = require('debug')('teamwork-backend-api:debug');
const db = require('../db/index.js');

const Helper = {
  async updateLogin(userId) {
    try {
      const loginDate = moment().format();
      const updateLogin =
        'UPDATE sys_users set last_login=$1 where id=$2 returning id';
      const { rows } = await db.query(updateLogin, [loginDate, userId]);

      if (!rows[0].id) {
        return false;
      }
      return true;
    } catch (error) {
      debug(error);
      return false;
    }
  },

  generateToken(id) {
    const secretWord = config.get('secret');
    const expiry = config.get('expiry');
    const token = jwt.sign(
      {
        userId: id
      },
      secretWord,
      { expiresIn: expiry }
    );
    return token;
  },

  async sendMail(message) {
    const transport = nodemailer.createTransport({
      host: config.get('host'),
      port: config.get('email_port'),
      auth: {
        user: config.get('user'),
        pass: config.get('pass')
      }
    });
    // eslint-disable-next-line consistent-return
    transport.sendMail(message, (err, info) => {
      if (err) {
        debug(err);
        return false;
      }
      if (info) {
        debug(info);
        return true;
      }
    });
  }
};

module.exports = Helper;
