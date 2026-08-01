const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        heartbeatFrequencyMS: 10000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error(`Attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt < retries) {
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  console.error('\nFailed to connect to MongoDB. Please check:');
  console.error('1. Your IP is whitelisted in Atlas Network Access');
  console.error('2. Your database user credentials are correct');
  console.error('3. Your cluster is active (not paused)\n');
  process.exit(1);
};

module.exports = connectDB;
