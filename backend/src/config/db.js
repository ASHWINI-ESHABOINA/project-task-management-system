const mongoose = require("mongoose");

function redactMongoUri(uri) {
  if (!uri) return uri;
  // redact credentials if present: mongodb://user:pass@host -> mongodb://***:***@host
  return uri.replace(/\/\/([^/@:]+):([^/@]+)@/g, "//***:***@");
}

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is required (set it in your .env)");
  }

  mongoose.set("strictQuery", true);

  try {
    return await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
  } catch (err) {
    const message = `MongoDB connection error (${redactMongoUri(mongoUri)}): ${err.message}`;
    err.message = message;
    throw err;
  }
}

module.exports = { connectDB };

