const express = require('express');

const router = express.Router();
const Auth = require('../../auth/middleware/auth.js');
const Validate = require('../../auth/validate.js');
const db = require('../../db/index.js');

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
    return res.status(400).send({
      status: 'error',
      error: 'incomplete user details'
    });
  }
  if (!Validate.isValidEmail(req.body.email)) {
    return res.status(400).send({
      status: 'error',
      error: 'invalid user email address'
    });
  }
  // console.log(await Validate.isEmailUsed(req.body.email));
  if (await Validate.isEmailUsed(req.body.email)) {
    return res.status(400).send({
      status: 'error',
      error: 'email address already in use'
    });
  }

  if (await Validate.isPhoneUsed(req.body.phone)) {
    return res.status(400).send({
      status: 'error',
      error: 'phone already in use'
    });
  }

  res.status(200);
  res.json({
    status: 'success',
    message: 'Welcome to Api v1'
  });
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
      return res.status(400).send({
        status: 'error',
        error: 'invalid login credentials'
      });
    }
    if (!Validate.comparePassword(rows[0].password, req.body.password)) {
      return res.status(400).send({
        status: 'error',
        error: 'The credentials you provided is incorrect'
      });
    }
    const token = Validate.generateToken(rows[0].id);
    if (await !Validate.updateLogin(rows[0].id)) {
      return res.status(500).send({
        status: 'error',
        error: 'an error occured while processing your login request'
      });
    }
    return res.status(200).send({ token });
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      error: 'an error occured while processing your request'
    });
  }
});

module.exports = router;
