const prisma = require('../../config/prisma.js');

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}


// Create Payment Intent
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;
    const userId = req.user.id;

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { passenger: true },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.passengerId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.paymentStatus === 'COMPLETED') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    const useMockPayment = !stripe;

    const paymentIntentId = useMockPayment
      ? `mock-${Date.now()}`
      : (await stripe.paymentIntents.create({
          amount: Math.round(booking.totalPrice * 100),
          currency: 'usd',
          metadata: {
            bookingId: booking.id,
            bookingReference: booking.bookingReference,
            userId,
          },
          description: `Payment for booking ${booking.bookingReference}`,
        })).id;

    const clientSecret = useMockPayment ? 'mock-client-secret' : 'stripe-client-secret';

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId,
        amount: booking.totalPrice,
        currency: 'GMD',
        paymentMethod,
        transactionId: paymentIntentId,
        status: 'PENDING',
        provider: 'STRIPE',
      },
    });

    res.status(201).json({
      message: 'Payment intent created',
      payment,
      clientSecret,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};

// Confirm Payment
const confirmPayment = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;
    const userId = req.user.id;

    // Get payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment failed' });
      }
    } else if (!transactionId) {
      return res.status(400).json({ message: 'Payment failed' });
    }

    // Update payment and booking status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'COMPLETED' },
    });

    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { paymentStatus: 'COMPLETED' },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        bookingId: payment.bookingId,
        type: 'PAYMENT_CONFIRMED',
        title: 'Payment Confirmed',
        message: `Payment of GMD ${payment.amount} has been confirmed for booking ${payment.booking.bookingReference}`,
      },
    });

    res.status(200).json({
      message: 'Payment confirmed successfully',
      payment: updatedPayment,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
};

// Get Payment History
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const payments = await prisma.payment.findMany({
      where: { userId },
      include: { booking: true },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.payment.count({ where: { userId } });

    res.status(200).json({
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
};