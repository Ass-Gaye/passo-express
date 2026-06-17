const express = require('express');
const { body } = require('express-validator');
const adminController = require('./admin.controller');
const { verifyToken, checkRole } = require('../../middleware/auth.middleware');

const router = express.Router();

// Middleware to check admin role
const adminOnly = checkRole(['SUPER_ADMIN', 'ADMIN']);

// Validation
const updateUserStatusValidation = [
  body('status').isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED']),
];

// Routes
router.get('/dashboard/stats', verifyToken, adminOnly, adminController.getDashboardStats);
router.get('/users', verifyToken, adminOnly, adminController.getAllUsers);
router.put('/users/:userId/status', verifyToken, adminOnly, updateUserStatusValidation, adminController.updateUserStatus);
router.get('/reports/daily', verifyToken, adminOnly, adminController.getDailyReport);

module.exports = router;