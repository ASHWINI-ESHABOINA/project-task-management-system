const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes");
const authRoutes = require("./routes/authRoutes");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

function parseCorsOrigins(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

function createApp() {
  const app = express();

  app.disable("x-powered-by");

  // Middleware
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));

  // CORS setup (safe fallback for Railway + dev)
  const allowedOrigins = parseCorsOrigins(process.env.CORS_ORIGINS);
  const isProduction = process.env.NODE_ENV === "production";

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);

        const normalizedOrigin = origin.replace(/\/+$/, "");

        if (allowedOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }

        if (!isProduction && allowedOrigins.length === 0) {
          return callback(null, true);
        }

        return callback(null, true); // 🔥 relaxed for debugging Railway issues
      },
      credentials: true,
    })
  );

  // 🔥 HEALTH CHECK (IMPORTANT FOR RAILWAY DEBUG)
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      message: "API is running",
      env: process.env.NODE_ENV || "development",
    });
  });

  // Root route
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "API running",
      status: "healthy",
    });
  });

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api", apiRoutes);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };