const express = require('express');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');

const router = express.Router();
const Auth = require('../../auth/middleware/auth.js');
const Validate = require('../../auth/validate.js');
const Helper = require('../../auth/helper.js');
const db = require('../../db/index.js');

// eslint-disable-next-line consistent-return
router.post('/auth/create-user', Auth.verifyTokenAdmin, async (req, res) => {
  // eslint-disable-next-line max-len
  if (
    !req.body.firstName
    || !req.body.lastName
    || !req.body.email
    || !req.body.phone
    || !req.body.is_superuser
    || !req.body.gender
    || !req.body.jobRole
    || !req.body.department
    || !req.body.address
  ) {
    return res.status(401).send({
      status: 'error',
      error: 'incomplete user details'
    });
  }
  if (!Validate.isValidEmail(req.body.email)) {
    return res.status(401).send({
      status: 'error',
      error: 'invalid user email address'
    });
  }
  // console.log(await Validate.isEmailUsed(req.body.email));
  if (await Validate.isEmailUsed(req.body.email)) {
    return res.status(401).send({
      status: 'error',
      error: 'email address already in use'
    });
  }

  if (await Validate.isPhoneUsed(req.body.phone)) {
    return res.status(401).send({
      status: 'error',
      error: 'phone already in use'
    });
  }
  const password = randomstring.generate(6);
  const hash = bcrypt.hashSync(password, 10);
  const user =    'INSERT INTO sys_users(password, firstName, lastName, email, phone, is_superuser, password_status,login_attempts,gender,jobRole,department,address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12) returning id';
  const { rows } = await db.query(user, [
    hash,
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    req.body.phone,
    req.body.is_superuser,
    'Change',
    0,
    req.body.gender,
    req.body.jobRole,
    req.body.department,
    req.body.address
  ]);
  try {
    if (!rows[0].id) {
      return res.status(500).send({
        status: 'error',
        error: 'An error occured while saving the user'
      });
    }
    const message = {
      from: 'ipkiruig83@gmail.com', // Sender address
      to: req.body.email, // List of recipients
      subject: 'Password for Teamwork App', // Subject line
      text: `You have been successfully registered to access this app. your password is ${password}` // Plain text body
    };
    if (await !Helper.sendMail(message)) {
      return res.status(500).send({
        status: 'error',
        error: 'An error occured while sending mail to the user'
      });
    }
    const token = Helper.generateToken(rows[0].id);
    res.status(201);
    res.json({
      status: 'success',
      data: {
        message: 'User account successfully created',
        token,
        userId: rows[0].id
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      error
    });
  }
});

router.post('/auth/signin', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      status: 'error',
      error: 'login incomplete details'
    });
  }
  if (!Validate.isValidEmail(req.body.email)) {
    return res.status(400).send({
      status: 'error',
      error: 'invalid email address'
    });
  }
  const text = 'SELECT * FROM sys_users WHERE email = $1';
  try {
    const { rows } = await db.query(text, [req.body.email]);
    if (!rows[0]) {
      return res.status(401).send({
        status: 'error',
        error: 'invalid login credentials'
      });
    }
    if (!Validate.comparePassword(rows[0].password, req.body.password)) {
      return res.status(401).send({
        status: 'error',
        error: 'invalid login credentials'
      });
    }
    const token = Helper.generateToken(rows[0].id);
    if (await !Helper.updateLogin(rows[0].id)) {
      return res.status(500).send({
        status: 'error',
        error: 'an error occured while processing your login request'
      });
    }
    return res.status(200).send({
      status: 'success',
      data: {
        token,
        userId: rows[0].id
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      error: 'an error occured while processing your request'
    });
  }
});

module.exports = router;
