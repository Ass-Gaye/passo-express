const router = require('express').Router();

const fareController = require('./fares.controller.js');

router.get('/', fareController.getFares);

router.get('/:id', fareController.getFare);

router.post('/', fareController.createFare);

router.put('/:id', fareController.updateFare);

router.delete('/:id', fareController.deleteFare);


module.exports = router;
