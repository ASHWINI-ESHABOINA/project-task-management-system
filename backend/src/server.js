const http = require("http");

const dotenv = require("dotenv");

dotenv.config();

const { createApp } = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  server.listen(PORT);

  const shutdown = async (signal) => {
    server.close(async () => {
      try {
        const mongoose = require("mongoose");
        await mongoose.connection.close(false);
      } finally {
        process.exit(0);
      }
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch(() => {
  process.exit(1);
});

