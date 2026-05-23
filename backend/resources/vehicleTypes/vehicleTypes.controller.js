// resources/vehicle-types/vehicleTypes.controller.js

const vehicleTypeDb = require('./vehicleTypes.db.js')

const create = async (req, res) => {
  try {
    const vehicleType = await vehicleTypeDb.create(req.body);

    return res.status(201).json(vehicleType);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

const getAll = async (req, res) => {
  try {
    const vehicleTypes = await vehicleTypeDb.getAll();

    return res.json(vehicleTypes); 

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

const getOne = async (req, res) => {
  try {
    const vehicleType = await vehicleTypeDb.getOne(req.params.id);

    if (!vehicleType) {
      return res.status(404).json({
        message: 'Vehicle type not found'
      });
    }

    return res.json(vehicleType);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

const update = async (req, res) => {
  try {
    const vehicleType = await vehicleTypeDb.update(
      req.params.id,
      req.body
    );

    return res.json(vehicleType);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

const remove = async (req, res) => {
  try {
    await vehicleTypeDb.remove(req.params.id);

    return res.json({
      message: 'Vehicle type deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
}