const bcrypt = require('bcrypt');
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
  }
};

module.exports = Validate;
