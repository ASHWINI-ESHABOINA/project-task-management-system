function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (err && err.message === "Not allowed by CORS") {
    statusCode = 403;
  }

  res.status(statusCode).json({
    message: err.message || "Server Error",
    ...(process.env.NODE_ENV === "production"
      ? null
      : {
          stack: err.stack,
        }),
  });
}

module.exports = { errorHandler };

