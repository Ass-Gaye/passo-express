const prisma = require('../../config/prisma.js');

// Create Trip
const createTrip = async (req, res) => {
  try {
    const { routeId, vehicleId, departureTime, estimatedArrival } = req.body;

    const trip = await prisma.trip.create({
      data: {
        routeId,
        vehicleId,
        departureTime: new Date(departureTime),
        estimatedArrival: new Date(estimatedArrival),
        status: 'SCHEDULED',
      },
      include: {
        route: { include: { fromLocality: true, toLocality: true, vehicleType: true } },
        vehicle: true,
      },
    });

    res.status(201).json({
      message: 'Trip created successfully',
      trip,
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Error creating trip', error: error.message });
  }
};

// Get Active Routes
const getRoutes = async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      include: {
        fromLocality: true,
        toLocality: true,
        vehicleType: true,
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ message: 'Error fetching routes', error: error.message });
  }
};

// Get Vehicles for Route
const getVehicles = async (req, res) => {
  try {
    const routeId = req.query.routeId ? parseInt(req.query.routeId, 10) : undefined;
    const where = {
      status: 'AVAILABLE',
      ...(routeId ? { routeId } : {}),
    };

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        vehicleType: true,
        route: { include: { fromLocality: true, toLocality: true } },
      },
      orderBy: { licensePlate: 'asc' },
    });

    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
};

// Get All Trips
const getAllTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        route: { include: { fromLocality: true, toLocality: true, vehicleType: true } },
        vehicle: true,
        bookings: {
          where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
        },
      },
      orderBy: { departureTime: 'asc' },
    });

    const mappedTrips = trips.map((trip) => {
      const capacity = trip.vehicle?.capacity || 0;
      const occupiedSeats = trip.bookings.length;
      const availableSeats = capacity > 0 ? Math.max(capacity - occupiedSeats, 0) : null;

      return {
        ...trip,
        availableSeats,
        occupiedSeats,
      };
    });

    res.status(200).json(mappedTrips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
};

// Get Available Trips
const getAvailableTrips = async (req, res) => {
  try {
    const { fromLocalityId, toLocalityId, date } = req.query;

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const trips = await prisma.trip.findMany({
      where: {
        route: {
          fromLocalityId: parseInt(fromLocalityId),
          toLocalityId: parseInt(toLocalityId),
        },
        departureTime: {
          gte: startDate,
          lte: endDate,
        },
        status: { in: ['SCHEDULED', 'ONGOING'] },
      },
      include: {
        route: { include: { fromLocality: true, toLocality: true, vehicleType: true } },
        vehicle: true,
        bookings: {
          where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
        },
      },
    });

    const availableTrips = trips
      .map((trip) => {
        const capacity = trip.vehicle?.capacity || 0;
        const occupiedSeats = trip.bookings.length;
        const availableSeats = capacity > 0 ? Math.max(capacity - occupiedSeats, 0) : null;

        return {
          ...trip,
          availableSeats,
          occupiedSeats,
        };
      })
      .filter((trip) => trip.availableSeats === null || trip.availableSeats > 0);

    res.status(200).json(availableTrips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
};

// Get Trip By ID
const getTripById = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId, 10);

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        route: { include: { fromLocality: true, toLocality: true, vehicleType: true } },
        vehicle: true,
        bookings: {
          where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const fare = await prisma.fare.findFirst({
      where: {
        fromLocalityId: trip.route.fromLocalityId,
        toLocalityId: trip.route.toLocalityId,
        vehicleTypeId: trip.route.vehicleTypeId,
        isActive: true,
      },
    });

    const capacity = trip.vehicle?.capacity || 0;
    const occupiedSeats = trip.bookings.length;
    const availableSeats = capacity > 0 ? Math.max(capacity - occupiedSeats, 0) : null;

    res.status(200).json({
      ...trip,
      route: {
        ...trip.route,
        fares: fare ? [fare] : [],
      },
      availableSeats,
      occupiedSeats,
    });
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ message: 'Error fetching trip', error: error.message });
  }
};

// Update Trip Status
const updateTripStatus = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { status } = req.body;

    const trip = await prisma.trip.update({
      where: { id: parseInt(tripId) },
      data: { status },
      include: { bookings: true },
    });

    // Create notifications for all passengers
    if (status === 'DELAYED' || status === 'CANCELLED') {
      const notificationType = status === 'DELAYED' ? 'TRIP_DELAYED' : 'BOOKING_CANCELLED';
      const message = status === 'DELAYED' ? 'Your trip has been delayed' : 'Your trip has been cancelled';

      for (const booking of trip.bookings) {
        if (booking.status !== 'CANCELLED') {
          await prisma.notification.create({
            data: {
              userId: booking.passengerId,
              bookingId: booking.id,
              type: notificationType,
              title: `Trip ${status}`,
              message,
            },
          });
        }
      }
    }

    res.status(200).json({
      message: 'Trip status updated',
      trip,
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ message: 'Error updating trip', error: error.message });
  }
};

const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { routeId, vehicleId, departureTime, estimatedArrival, status } = req.body;

    const data = {};
    if (routeId !== undefined) data.routeId = routeId;
    if (vehicleId !== undefined) data.vehicleId = vehicleId;
    if (departureTime !== undefined) data.departureTime = new Date(departureTime);
    if (estimatedArrival !== undefined) data.estimatedArrival = new Date(estimatedArrival);
    if (status !== undefined) data.status = status;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'No trip fields provided for update' });
    }

    const trip = await prisma.trip.update({
      where: { id: parseInt(tripId, 10) },
      data,
      include: {
        route: { include: { fromLocality: true, toLocality: true, vehicleType: true } },
        vehicle: true,
      },
    });

    res.status(200).json({
      message: 'Trip updated successfully',
      trip,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Trip not found' });
    }
    console.error('Error updating trip:', error);
    res.status(500).json({ message: 'Error updating trip', error: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    await prisma.trip.delete({
      where: { id: parseInt(tripId, 10) },
    });

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Trip not found' });
    }
    console.error('Error deleting trip:', error);
    res.status(500).json({ message: 'Error deleting trip', error: error.message });
  }
};

module.exports = {
  createTrip,
  getRoutes,
  getVehicles,
  getAllTrips,
  getAvailableTrips,
  getTripById,
  updateTrip,
  updateTripStatus,
  deleteTrip,
};