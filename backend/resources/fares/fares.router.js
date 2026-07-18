const router = require('express').Router();

const fareController = require('./fares.controller.js');
const { verifyToken, checkUserStatus, checkRole } = require('../../middleware/auth.middleware');

const adminOnly = checkRole(['SUPER_ADMIN', 'ADMIN']);

router.get('/', fareController.getFares);
router.get('/:id', fareController.getFare);
router.post('/', verifyToken, checkUserStatus, adminOnly, fareController.createFare);
router.put('/:id', verifyToken, checkUserStatus, adminOnly, fareController.updateFare);
router.delete('/:id', verifyToken, checkUserStatus, adminOnly, fareController.deleteFare);

module.exports = router;
