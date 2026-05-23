// resources/vehicle-types/vehicleTypes.routes.js

const express = require('express')

const router = express.Router()

const vehicleTypeController = require('./vehicleTypes.controller.js')


router.post('/', vehicleTypeController.create)

router.get('/', vehicleTypeController.getAll)

router.get('/:id', vehicleTypeController.getOne)

router.put('/:id', vehicleTypeController.update)

router.delete('/:id', vehicleTypeController.remove)


module.exports = router