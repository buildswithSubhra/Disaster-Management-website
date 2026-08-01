require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const disasterRoutes = require('./routes/disasters');
const rescuerRoutes = require('./routes/rescuers');
const shelterRoutes = require('./routes/shelters');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/disasters', disasterRoutes);
app.use('/api/rescuers', rescuerRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Disaster Management & Emergency Response API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      disasters: '/api/disasters',
      rescuers: '/api/rescuers',
      shelters: '/api/shelters',
      notifications: '/api/notifications',
      admin: '/api/admin'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

const startServer = async () => {
  await connectDB();

  const User = require('./models/User');
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('No data found. Seeding database...');
    const seedData = require('./seed/seedData');
    await seedData();
  }

  app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`  Disaster Management API Server`);
    console.log(`  Running on port ${PORT}`);
    console.log(`  http://localhost:${PORT}`);
    console.log(`========================================`);
    console.log(`  API Endpoints:`);
    console.log(`  Auth:         http://localhost:${PORT}/api/auth`);
    console.log(`  Disasters:    http://localhost:${PORT}/api/disasters`);
    console.log(`  Rescuers:     http://localhost:${PORT}/api/rescuers`);
    console.log(`  Shelters:     http://localhost:${PORT}/api/shelters`);
    console.log(`  Notifications: http://localhost:${PORT}/api/notifications`);
    console.log(`  Admin:        http://localhost:${PORT}/api/admin`);
    console.log(`========================================`);
  });
};

startServer();

module.exports = app;
