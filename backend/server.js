require('dotenv').config();

const app = require('./index');
const http = require('http');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_IO_PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO for real-time updates
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
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

// Start server
server.listen(PORT, () => {
  console.log(`🚀 PASSO Express API running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for real-time updates`);
  console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});