const router = require('express').Router();

const localityController = require('./localities.controller.js');

router.get('/', localityController.getLocalities);

router.get('/:id', localityController.getLocality);

router.post('/', localityController.createLocality);

router.put('/:id', localityController.updateLocality);

router.delete('/:id', localityController.deleteLocality);



module.exports = router;