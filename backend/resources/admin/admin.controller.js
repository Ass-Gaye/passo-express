const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Verify admin role
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || !['SUPER_ADMIN', 'ADMIN'].includes(admin.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Get statistics
    const totalUsers = await prisma.user.count();
    const totalBookings = await prisma.booking.count();
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'COMPLETED' },
    });
    const activeTrips = await prisma.trip.count({
      where: { status: { in: ['SCHEDULED', 'ONGOING'] } },
    });
    const completedTrips = await prisma.trip.count({
      where: { status: 'COMPLETED' },
    });

    res.status(200).json({
      statistics: {
        totalUsers,
        totalBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeTrips,
        completedTrips,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      where: {
        ...(role && { role }),
        ...(status && { status }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true,
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count({
      where: {
        ...(role && { role }),
        ...(status && { status }),
      },
    });

    res.status(200).json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Update User Status
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { status },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      },
    });

    res.status(200).json({
      message: 'User status updated',
      user,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};

// Get Daily Revenue Report
const getDailyReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const dailyStats = await prisma.dailyStatistics.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'asc' },
    });

    res.status(200).json({ dailyStats });
  } catch (error) {
    console.error('Error fetching daily report:', error);
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getDailyReport,
};