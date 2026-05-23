const router = require('express').Router();

const fareController = require('./fares.controller.js');

router.get('/', fareController.getFares);

router.get('/:id', fareController.getFare);

router.post('/', fareController.createFare);

router.put('/', fareController.updateFare);

router.delete('/', fareController.deleteFare);


module.exports = router;
