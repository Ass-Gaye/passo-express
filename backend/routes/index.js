const router = require('express').Router();

const faresRoutes = require('../resources/fares/fares.router.js');
const localityRoutes = require('../resources/localities/localities.router.js');
const vehicleTypeRoutes = require('../resources/vehicleTypes/vehicleTypes.router.js');

router.use('/fares', faresRoutes);

router.use('/localities', localityRoutes);

router.use('/vehicleTypes', vehicleTypeRoutes);


module.exports = router;