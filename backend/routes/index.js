const router = require('express').Router();

const faresRoutes = require('../resources/fares/fares.router.js');
const localityRoutes = require('../resources/localities/localities.router.js');
const vehicleTypeRoutes = require('../resources/vehicle-types/vehicleTypes.router.js');

router.use('/fares', faresRoutes);

router.use('/localities', localityRoutes);

router.use('/vehicle-types', vehicleTypeRoutes);


module.exports = router;





