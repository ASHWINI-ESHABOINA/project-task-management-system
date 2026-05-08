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
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));

  const allowedOrigins = parseCorsOrigins(process.env.CORS_ORIGINS);
  const isProduction = process.env.NODE_ENV === "production";

  app.use(
    cors({
      origin(origin, callback) {
        // Allow server-to-server / curl / same-origin requests with no Origin header.
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.replace(/\/+$/, "");

        if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
        if (!isProduction && allowedOrigins.length === 0) return callback(null, true);

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  app.get("/", (req, res) => {
    res.status(200).json({ message: "API running" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

