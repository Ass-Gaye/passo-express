const express = require('express');
const { body } = require('express-validator');
const paymentsController = require('./payments.controller');
const { verifyToken, checkUserStatus } = require('../../middleware/auth.middleware');

const router = express.Router();

// Validation
const createPaymentValidation = [
  body('bookingId').isInt().withMessage('Booking ID is required'),
  body('paymentMethod').isIn(['CARD', 'MOBILE_MONEY', 'BANK_TRANSFER', 'WALLET']),
];

const confirmPaymentValidation = [
  body('paymentId').isInt().withMessage('Payment ID is required'),
  body('transactionId').notEmpty().withMessage('Transaction ID is required'),
];

// Routes
router.post('/intent', verifyToken, checkUserStatus, createPaymentValidation, paymentsController.createPaymentIntent);
router.post('/confirm', verifyToken, checkUserStatus, confirmPaymentValidation, paymentsController.confirmPayment);
router.get('/history', verifyToken, checkUserStatus, paymentsController.getPaymentHistory);

module.exports = router;