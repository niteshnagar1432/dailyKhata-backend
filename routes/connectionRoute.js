const express = require('express');
const { verifyToken } = require('../controllers/indexController');
const { createConnection } = require('../controllers/connectionController');
const route = express.Router();

route.post('/create',verifyToken,createConnection);

module.exports = route;