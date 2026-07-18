const prisma = require('../../config/prisma.js');

// Update Vehicle Location (GPS Tracking)
const updateVehicleLocation = async (req, res) => {
  try {
    const { vehicleId, latitude, longitude, speed, accuracy } = req.body;

    // Update vehicle position
    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        latitude,
        longitude,
        lastLocationUpdate: new Date(),
      },
    });

    // Record location history
    await prisma.vehicleLocation.create({
      data: {
        vehicleId,
        latitude,
        longitude,
        speed,
        accuracy,
      },
    });

    // Emit real-time update via WebSocket
    // req.io.emit(`vehicle-${vehicleId}`, { latitude, longitude, speed });

    res.status(200).json({
      message: 'Location updated',
      vehicle,
    });
  } catch (error) {
    console.error('Error updating vehicle location:', error);
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
};

// Get Vehicle Location History
const getLocationHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;

    const locations = await prisma.vehicleLocation.findMany({
      where: {
        vehicleId: parseInt(vehicleId),
        timestamp: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { timestamp: 'asc' },
      take: parseInt(limit),
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching location history:', error);
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};

// Get Real-time Vehicle Status
const getVehicleStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) },
      include: {
        route: { include: { fromLocality: true, toLocality: true } },
        operator: { select: { id: true, name: true, phone: true } },
      },
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle status:', error);
    res.status(500).json({ message: 'Error fetching status', error: error.message });
  }
};

// Get Vehicle Types
const getVehicleTypes = async (req, res) => {
  try {
    const vehicleTypes = await prisma.vehicleType.findMany({
      orderBy: { name: 'asc' },
    });

    res.status(200).json(vehicleTypes);
  } catch (error) {
    console.error('Error fetching vehicle types:', error);
    res.status(500).json({ message: 'Error fetching vehicle types', error: error.message });
  }
};

module.exports = {
  updateVehicleLocation,
  getLocationHistory,
  getVehicleStatus,
  getVehicleTypes,
};