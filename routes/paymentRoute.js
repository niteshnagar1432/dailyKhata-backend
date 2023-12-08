const express = require('express');
const { verifyToken } = require('../controllers/indexController');
const { createPayment, viewPayment, deletePayment, acceptPayment, paidPayment, allPaid } = require('../controllers/paymentController');
const route = express.Router();

route.post('/create',verifyToken,createPayment);
route.get('/view/:paymentId',verifyToken,viewPayment);
route.get('/accept/:paymentId',verifyToken,acceptPayment);
route.get('/paid/:paymentId',verifyToken,paidPayment);
route.get('/delete/:paymentId',verifyToken,deletePayment);

route.get('/paid/all/:connectionId',verifyToken,allPaid);

module.exports = route;