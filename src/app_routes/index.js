import express from 'express';

const router = express.Router();
// eslint-disable-next-line import/no-unresolved
const v1 = require('../../src/app_routes/api_v1/index');

router.use('/api/v1', v1);

module.exports = router;
