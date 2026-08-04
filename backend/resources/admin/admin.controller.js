const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
  try {
    if (!['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const tableExists = async (tableName) => {
      const result = await prisma.$queryRawUnsafe(
        `SELECT EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = $1
        ) AS exists`,
        tableName
      );
      return result[0]?.exists === true;
    };

    const totalUsersResult = await prisma.$queryRaw`SELECT COUNT(*) AS count FROM "User"`;

    const totalBookingsResult = await (await tableExists('booking'))
      ? await prisma.$queryRaw`SELECT COUNT(*) AS count FROM "booking"`
      : [{ count: 0 }];

    const totalRevenueResult = await (await tableExists('payment'))
      ? await prisma.$queryRaw`
          SELECT COALESCE(SUM(amount), 0) AS total
          FROM "payment"
          WHERE status = 'COMPLETED'
        `
      : [{ total: 0 }];

    const activeTripsResult = await (await tableExists('trip'))
      ? await prisma.$queryRaw`
          SELECT COUNT(*) AS count
          FROM "trip"
          WHERE status IN ('SCHEDULED', 'ONGOING')
        `
      : [{ count: 0 }];

    const completedTripsResult = await (await tableExists('trip'))
      ? await prisma.$queryRaw`
          SELECT COUNT(*) AS count
          FROM "trip"
          WHERE status = 'COMPLETED'
        `
      : [{ count: 0 }];

    res.status(200).json({
      statistics: {
        totalUsers: Number(totalUsersResult[0]?.count || 0),
        totalBookings: Number(totalBookingsResult[0]?.count || 0),
        totalRevenue: Number(totalRevenueResult[0]?.total || 0),
        activeTrips: Number(activeTripsResult[0]?.count || 0),
        completedTrips: Number(completedTripsResult[0]?.count || 0),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (!['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { role, status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filters = [];
    const values = [];
    let filterSql = '';

    if (role) {
      values.push(role);
      filters.push(`role = $${values.length}`);
    }
    if (status) {
      values.push(status);
      filters.push(`status = $${values.length}`);
    }

    if (filters.length) {
      filterSql = `WHERE ${filters.join(' AND ')}`;
    }

    const usersQuery = `
      SELECT id, email, name, role, status, "createdAt"
      FROM "User"
      ${filterSql}
      ORDER BY "createdAt" DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const users = await prisma.$queryRawUnsafe(usersQuery, ...values, Number(limit), skip);
    const countQuery = `
      SELECT COUNT(*) AS count
      FROM "User"
      ${filterSql}
    `;
    const countResult = await prisma.$queryRawUnsafe(countQuery, ...values);
    const total = Number(countResult[0]?.count || 0);

    res.status(200).json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    if (!['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { userId } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateQuery = `
      UPDATE "User"
      SET status = $1
      WHERE id = $2
      RETURNING id, email, name, status
    `;
    const updatedUsers = await prisma.$queryRawUnsafe(updateQuery, status, Number(userId));
    const user = updatedUsers[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User status updated', user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};

const getDailyReport = async (req, res) => {
  try {
    if (!['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const checkTableExists = async (tableName) => {
      const result = await prisma.$queryRawUnsafe(
        `SELECT EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = $1
        ) AS exists`,
        tableName
      );
      return result[0]?.exists === true;
    };

    if (!(await checkTableExists('DailyStatistics'))) {
      return res.status(200).json({ dailyStats: [] });
    }

    const dailyStats = await prisma.$queryRaw`
      SELECT *
      FROM "DailyStatistics"
      WHERE date >= ${start} AND date <= ${end}
      ORDER BY date ASC
    `;

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