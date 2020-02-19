const bcrypt = require('bcrypt');
const debug = require('debug')('teamwork-backend-api:debug');
const db = require('../db/index.js');

const Validate = {
  // eslint-disable-next-line consistent-return
  hashPassword(password) {
    try {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    } catch (error) {
      debug(error);
    }
  },

  // eslint-disable-next-line consistent-return
  comparePassword(hashPassword, password) {
    try {
      return bcrypt.compareSync(password, hashPassword);
    } catch (error) {
      debug(error);
    }
  },

  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  async isEmailUsed(email) {
    try {
      const text = 'SELECT EXISTS (SELECT 1 FROM sys_users WHERE email = $1)';
      const { rows } = await db.query(text, [email]);
      return rows[0].exists;
    } catch (error) {
      debug(error);
      return false;
    }
  },

  async isPhoneUsed(phone) {
    try {
      const textP = 'SELECT EXISTS(SELECT 1 FROM sys_users WHERE phone = $1)';
      const { rows } = await db.query(textP, [phone]);
      return rows[0].exists;
    } catch (error) {
      debug(error);
      return false;
    }
  }
};

module.exports = Validate;
