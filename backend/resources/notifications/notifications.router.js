const express = require('express');
const notificationsController = require('./notifications.controller');
const { verifyToken, checkUserStatus } = require('../../middleware/auth.middleware');

const router = express.Router();

// Routes
router.get('/', verifyToken, checkUserStatus, notificationsController.getNotifications);
router.get('/unread/count', verifyToken, checkUserStatus, notificationsController.getUnreadCount);
router.put('/:notificationId/read', verifyToken, checkUserStatus, notificationsController.markAsRead);
router.put('/read-all', verifyToken, checkUserStatus, notificationsController.markAllAsRead);
router.delete('/:notificationId', verifyToken, checkUserStatus, notificationsController.deleteNotification);

module.exports = router;