const express = require('express');

const router = express.Router();

const routesV1 = require('../routes/routes_v1');

router.use(routesV1);

module.exports = router;
