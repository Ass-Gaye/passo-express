const prisma = require('../../config/prisma.js');
const { v4: uuidv4 } = require('uuid');


// Create Booking
const createBooking = async (req, res) => {
  try {
    const { tripId, fareId, seatNumber } = req.body;
    const passengerId = req.user.id;

    let resolvedFareId = fareId;

    // Check if trip exists and load its capacity and bookings
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        vehicle: true,
        route: true,
        bookings: {
          where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
          select: { id: true },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const occupiedSeats = trip.bookings.length;
    const capacity = trip.vehicle?.capacity || 0;

    if (capacity > 0 && occupiedSeats >= capacity) {
      return res.status(400).json({ message: 'Trip is fully booked' });
    }

    // Check if seat is available
    if (seatNumber) {
      const existingBooking = await prisma.booking.findFirst({
        where: {
          tripId,
          seatNumber,
          status: { in: ['CONFIRMED', 'COMPLETED'] },
        },
      });

      if (existingBooking) {
        return res.status(400).json({ message: 'Seat already booked' });
      }
    }

    if (!resolvedFareId) {
      const routeFare = await prisma.fare.findFirst({
        where: {
          fromLocalityId: trip.route.fromLocalityId,
          toLocalityId: trip.route.toLocalityId,
          vehicleTypeId: trip.route.vehicleTypeId,
          isActive: true,
        },
      });

      resolvedFareId = routeFare?.id;
    }

    // Get fare details
    const fare = await prisma.fare.findUnique({
      where: { id: resolvedFareId },
    });

    if (!fare) {
      return res.status(404).json({ message: 'Fare not found' });
    }

    const totalPrice = fare.price;
    const bookingReference = `PASSO-${Date.now()}-${uuidv4().slice(0, 8)}`;

    // Create booking
    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          tripId,
          passengerId,
          fareId: resolvedFareId,
          seatNumber,
          totalPrice,
          bookingReference,
          status: 'CONFIRMED',
          paymentStatus: 'PENDING',
        },
        include: {
          trip: { include: { route: true, vehicle: true } },
          fare: { include: { fromLocality: true, toLocality: true } },
          passenger: { select: { email: true, name: true, phone: true } },
        },
      }),
      prisma.trip.update({
        where: { id: tripId },
        data: { occupiedSeats: { increment: 1 } },
      }),
    ]);

    // Create notification
    await prisma.notification.create({
      data: {
        userId: passengerId,
        bookingId: booking.id,
        type: 'BOOKING_CONFIRMATION',
        title: 'Booking Confirmed',
        message: `Your booking ${bookingReference} has been confirmed. Total: GMD ${totalPrice}`,
      },
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get User Bookings
const getUserBookings = async (req, res) => {
  try {
    const passengerId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const bookings = await prisma.booking.findMany({
      where: {
        passengerId,
        ...(status && { status }),
      },
      include: {
        trip: { include: { route: true, vehicle: true } },
        fare: { include: { fromLocality: true, toLocality: true } },
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.booking.count({
      where: {
        passengerId,
        ...(status && { status }),
      },
    });

    res.status(200).json({
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const passengerId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.passengerId !== passengerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(bookingId) },
      data: { status: 'CANCELLED' },
    });

    if (booking.status === 'CONFIRMED') {
      await prisma.trip.update({
        where: { id: booking.tripId },
        data: { occupiedSeats: { decrement: 1 } },
      });
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: passengerId,
        bookingId: parseInt(bookingId),
        type: 'BOOKING_CANCELLED',
        title: 'Booking Cancelled',
        message: `Your booking ${booking.bookingReference} has been cancelled.`,
      },
    });

    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
};