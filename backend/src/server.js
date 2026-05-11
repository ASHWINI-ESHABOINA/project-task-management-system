const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const { createApp } = require("./app");
const { connectDB } = require("./config/db");

// ✅ Railway requires this exact usage
const PORT = process.env.PORT||5000;

async function start() {
  try {
    console.log("Starting server...");

    // 1. Connect DB (don’t block forever if fails silently)
    await connectDB();
    console.log("MongoDB connected");

    // 2. Create app
    const app = createApp();

    // 3. Create server
    const server = http.createServer(app);

    console.log("RAILWAY PORT RAW:", process.env.PORT);
    console.log("USING PORT:", PORT);

    // 🚨 IMPORTANT: ensure PORT exists
    if (!PORT) {
      throw new Error("PORT is not defined by Railway");
    }

    // 4. Listen
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

    // 5. Health debug log (helps Railway routing)
    console.log("Server initialized successfully");

    // 6. Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Shutting down...`);

      server.close(async () => {
        try {
          await mongoose.connection.close(false);
          console.log("MongoDB connection closed");
        } catch (err) {
          console.error("Mongo close error:", err.message);
        } finally {
          process.exit(0);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

start();