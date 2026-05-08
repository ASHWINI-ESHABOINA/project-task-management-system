const jwt = require("jsonwebtoken");

/**
 * SIGN JWT TOKEN
 */
function signToken(payload) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required (set it in your .env)");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * VERIFY JWT TOKEN
 */
function verifyToken(token) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required (set it in your .env)");
  }

  return jwt.verify(token, secret);
}

module.exports = { signToken, verifyToken };