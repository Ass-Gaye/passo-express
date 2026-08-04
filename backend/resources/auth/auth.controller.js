const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const getUserByEmailRaw = async (email) => {
  const users = await prisma.$queryRaw`
    SELECT id, email, password, name, phone, role, status, "profilePicture", "lastLogin", "createdAt", "updatedAt"
    FROM "User"
    WHERE email = ${email}
    LIMIT 1
  `;
  return users[0] || null;
};

const getUserByIdRaw = async (id) => {
  const users = await prisma.$queryRaw`
    SELECT id, email, name, phone, role, status, "profilePicture", "lastLogin", "createdAt", "updatedAt"
    FROM "User"
    WHERE id = ${id}
    LIMIT 1
  `;
  return users[0] || null;
};

// Email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Register User
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, phone, role } = req.body;

    // Check if user exists
    const existingUser = await getUserByEmailRaw(email);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user directly with pg so enum handling stays reliable.
    const userRole = (role || 'PASSENGER').toUpperCase();
    const dbClient = new Client({ connectionString: process.env.DATABASE_URL });
    await dbClient.connect();

    try {
      const createdUsers = await dbClient.query(
        `INSERT INTO "User" (email, password, name, phone, role, status, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, 'ACTIVE', now(), now())
         RETURNING id, email, name, role, status`,
        [email, hashedPassword, name, phone || null, userRole]
      );

      var user = createdUsers.rows[0];
    } finally {
      await dbClient.end();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    // Send welcome email (non-blocking in development if mail delivery fails)
    try {
      await transporter.sendMail({
        to: user.email,
        subject: 'Welcome to PASSO Express',
        html: `<h1>Welcome ${user.name}!</h1><p>Your account has been created successfully.</p>`,
      });
    } catch (mailError) {
      console.warn('Welcome email could not be sent:', mailError.message);
    }

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || typeof user.password === 'undefined') {
      user = await getUserByEmailRaw(email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If Prisma client doesn't include the password field (schema/client mismatch),
    // fall back to a raw SQL query to fetch the hashed password and basic fields.
    if (typeof user.password === 'undefined') {
      const rows = await prisma.$queryRaw`
        SELECT "id", "email", "name", "password", "role", "status"
        FROM "User"
        WHERE email = ${email}
        LIMIT 1
      `;

      if (!rows || rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // normalize row to user object
      user = rows[0];
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check user status
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ message: 'User account is not active' });
    }

    // Update last login (use raw SQL when Prisma client schema is out of date)
    try {
      await prisma.$executeRaw`
        UPDATE "User" SET "lastLogin" = ${new Date()} WHERE id = ${user.id}
      `;
    } catch (e) {
      console.warn('Could not update lastLogin via Prisma client, attempted raw SQL:', e.message);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const user = await getUserByIdRaw(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, profilePicture } = req.body;

    const updatedUsers = await prisma.$queryRaw`
      UPDATE "User"
      SET name = COALESCE(${name}, name),
          phone = COALESCE(${phone}, phone),
          "profilePicture" = COALESCE(${profilePicture}, "profilePicture"),
          "updatedAt" = now()
      WHERE id = ${req.user.id}
      RETURNING id, email, name, phone, role, "profilePicture"
    `;

    const user = updatedUsers[0];

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
};