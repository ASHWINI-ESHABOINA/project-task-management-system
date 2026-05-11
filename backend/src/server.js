const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const { createApp } = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    console.log("Starting server...");

    // 1. Connect to MongoDB first
    await connectDB();
    console.log("MongoDB connected");

    // 2. Create Express app
    const app = createApp();

    // 3. Create HTTP server
    const server = http.createServer(app);
    
    console.log("RAILWAY PORT:", process.env.PORT);

    // 4. Start server (IMPORTANT: bind to 0.0.0.0 for Railway)
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

    // 5. Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);

      server.close(async () => {
        try {
          await mongoose.connection.close(false);
          console.log("MongoDB connection closed");
        } catch (error) {
          console.error("Error closing MongoDB:", error.message);
        } finally {
          process.exit(0);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();