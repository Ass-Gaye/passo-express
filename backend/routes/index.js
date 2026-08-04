const router = require('express').Router();

const authRoutes = require('../resources/auth/auth.router.js');
const faresRoutes = require('../resources/fares/fares.router.js');
const localityRoutes = require('../resources/localities/localities.router.js');
const vehicleTypeRoutes = require('../resources/vehicle-types/vehicleTypes.router.js');
const bookingsRoutes = require('../resources/bookings/bookings.router.js');
const paymentsRoutes = require('../resources/payments/payments.router.js');
const notificationsRoutes = require('../resources/notifications/notifications.router.js');
const tripsRoutes = require('../resources/trips/trips.router.js');

router.use('/auth', authRoutes);
router.use('/fares', faresRoutes);
router.use('/localities', localityRoutes);
router.use('/vehicle-types', vehicleTypeRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/trips', tripsRoutes);

module.exports = router;





