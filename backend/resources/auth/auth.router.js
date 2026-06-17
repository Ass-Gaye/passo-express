const express = require('express');
const { body } = require('express-validator');
const authController = require('./auth.controller');
const { verifyToken, checkUserStatus } = require('../../middleware/auth.middleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').optional().isMobilePhone(),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', verifyToken, checkUserStatus, authController.getCurrentUser);
router.put('/profile', verifyToken, checkUserStatus, authController.updateProfile);

module.exports = router;