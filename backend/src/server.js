const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const { createApp } = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("MongoDB connected");

    const app = createApp();
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);

      server.close(async () => {
        try {
          await mongoose.connection.close(false);
          console.log("MongoDB connection closed");
        } catch (error) {
          console.error("Error closing MongoDB connection:", error.message);
        } finally {
          process.exit(0);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();