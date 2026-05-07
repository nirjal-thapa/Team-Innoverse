const mongoose = require("mongoose");
const runtime = require("./runtime");

const connectDB = async () => {
  if (process.env.USE_LOCAL_SEED === "true" || !process.env.MONGODB_URI) {
    runtime.useLocalSeed = true;
    console.log("Local seed mode active: MongoDB connection skipped");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    runtime.useLocalSeed = true;
    console.warn(`MongoDB unavailable, using local seed data: ${err.message}`);
  }
};

module.exports = connectDB;
