const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", process.env.MONGODB_URI ? "URI is set" : "URI is not set");
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    if (conn) {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      console.log("Database name:", conn.connection.name);
      console.log("Connection state:", conn.connection.readyState);
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });
    } else {
      console.log('Database connection failed!');
      process.exit(1);
    }
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    console.error("Full error:", err);
    process.exit(1);
  }
};

module.exports = { connectDB };
