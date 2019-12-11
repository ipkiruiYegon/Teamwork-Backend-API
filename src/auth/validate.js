const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const moment = require('moment');
const db = require('../db/index.js');

const Validate = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },

  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  async isEmailUsed(email) {
    const text = 'SELECT EXISTS (SELECT 1 FROM sys_users WHERE email = $1)';
    try {
      const { rows } = await db.query(text, [email]);
      return rows[0].exists;
    } catch (error) {
      return false;
    }
  },

  async isPhoneUsed(phone) {
    const textP = 'SELECT EXISTS(SELECT 1 FROM sys_users WHERE phone = $1)';
    try {
      const { rows } = await db.query(textP, [phone]);
      return rows[0].exists;
    } catch (error) {
      return false;
    }
  },

  async updateLogin(userId) {
    const loginDate = moment().format();
    const updateLogin =      'UPDATE sys_users set last_login=$1 where id=$2 returning id';
    const { rows } = await db.query(updateLogin, [loginDate, userId]);
    try {
      if (!rows[0].id) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  },

  generateToken(id) {
    const secretWord = config.get('secret');
    const token = jwt.sign(
      {
        userId: id
      },
      secretWord,
      { expiresIn: '4H' }
    );
    return token;
  }
};

module.exports = Validate;
