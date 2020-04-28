require('dotenv').config();
const crypto = require('crypto');

const nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken');

const moment = require('moment');

const debug = require('debug')('teamwork-backend-api:debug');

const db = require('../db/index.js');

const { ErrorHandler } = require('../auth/middleware/error');

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

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

  toTitleCase(word) {
    return word

      .split(' ')

      .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())

      .join(' ');
  },

  generateToken(id) {
    const secretWord = process.env.secret;

    const { expiry } = process.env;

    const token = jwt.sign(
      {
        userId: id,
      },

      secretWord,

      { expiresIn: expiry }
    );

    return token;
  },

  encryptData(data) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(data.toString());
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  },

  decryptData(enData) {
    try {
      debug(enData);
      debug(iv);
      const encryptedText = Buffer.from(enData, 'hex');
      debug('en-', encryptedText);
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(key),
        iv
      );
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (error) {
      debug(error);
      throw new ErrorHandler(
        500,
        'something went wrong while processing your request'
      );
    }
  },

  async sendMail(message) {
    const transport = nodemailer.createTransport({
      host: process.env.host,

      port: process.env.email_port,

      auth: {
        user: process.env.user,

        pass: process.env.pass,
      },
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
  },
};

module.exports = Helper;
