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
        route: { include: { fromLocality: true, toLocality: true } },
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

    res.status(200).json(trips);
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

    res.status(200).json({
      ...trip,
      route: {
        ...trip.route,
        fares: fare ? [fare] : [],
      },
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

module.exports = {
  createTrip,
  getAvailableTrips,
  getTripById,
  updateTripStatus,
};