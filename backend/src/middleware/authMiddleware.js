const User = require("../models/User");
const { verifyToken } = require("../config/jwt");
const { asyncHandler } = require("./asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  // 1. Check header format
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, missing token");
  }

  try {
    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Fetch user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    // 4. Attach user to request
    req.user = user;

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, invalid or expired token");
  }
});

module.exports = { protect };