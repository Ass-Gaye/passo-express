require('dotenv').config();

const app = require('./index');
const http = require('http');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_IO_PORT || 3001;
const isPortExplicitlySet = process.env.PORT !== undefined;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO for real-time updates
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join vehicle tracking room
  socket.on('join-vehicle-tracking', (vehicleId) => {
    socket.join(`vehicle-${vehicleId}`);
    console.log(`Client joined vehicle-${vehicleId}`);
  });

  // Join trip updates room
  socket.on('join-trip-updates', (tripId) => {
    socket.join(`trip-${tripId}`);
    console.log(`Client joined trip-${tripId}`);
  });

  // Broadcast vehicle location update
  socket.on('vehicle-location-update', (data) => {
    io.to(`vehicle-${data.vehicleId}`).emit('vehicle-location', data);
  });

  // Broadcast trip status update
  socket.on('trip-status-update', (data) => {
    io.to(`trip-${data.tripId}`).emit('trip-status-update', data);
  });

  // Join user notification room
  socket.on('join-user-notifications', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`Client joined user-${userId}`);
  });

  // Broadcast notification
  socket.on('send-notification', (data) => {
    io.to(`user-${data.userId}`).emit('notification', data);
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Attach io to app for use in routes
app.set('io', io);

// Global exception handlers to prevent the app from crashing silently
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

const tryListen = (port, attemptsLeft) => {
  const onError = (err) => {
    if (err && err.code === 'EADDRINUSE') {
      const nextPort = port + 1;

      if (!isPortExplicitlySet && attemptsLeft > 0) {
        console.warn(`Port ${port} is already in use, trying ${nextPort}...`);
        server.removeListener('error', onError);
        tryListen(nextPort, attemptsLeft - 1);
        return;
      }

      console.error(`Port ${port} is already in use. Please stop the other process or set a different PORT.`);
      server.removeListener('error', onError);
      process.exit(1);
    }

    if (err) {
      console.error('Server startup error:', err);
      process.exit(1);
    }
  };

  server.once('error', onError);
  server.listen(port, () => {
    console.log(`🚀 PASSO Express API running on port ${port}`);
    console.log(`📡 Socket.IO server ready for real-time updates`);
    console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
};

tryListen(Number(PORT), 6);
