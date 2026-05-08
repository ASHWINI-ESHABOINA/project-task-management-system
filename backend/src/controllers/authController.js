const User = require("../models/User");
const { signToken } = require("../config/jwt");
const { asyncHandler } = require("../middleware/asyncHandler");

// Email validation
function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(String(email || "").trim());
}

// Safe role handling
function normalizeRole(role) {
  const allowedRoles = ["admin", "member"];
  const r = String(role || "member").toLowerCase().trim();

  return allowedRoles.includes(r) ? r : "member";
}

/**
 * SIGNUP
 */
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || name.trim().length < 2) {
    res.status(400);
    throw new Error("Name must be at least 2 characters");
  }

  if (!email || !isValidEmail(email)) {
    res.status(400);
    throw new Error("Valid email is required");
  }

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: normalizeRole(role),
  });

  const token = signToken({
    id: user._id.toString(),
    role: user.role,
  });

  const safeUser = await User.findById(user._id).select("-password");

  res.status(201).json({
    token,
    user: safeUser,
  });
});

/**
 * LOGIN
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !isValidEmail(email)) {
    res.status(400);
    throw new Error("Valid email is required");
  }

  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = signToken({
    id: user._id.toString(),
    role: user.role,
  });

  const safeUser = await User.findById(user._id).select("-password");

  res.status(200).json({
    token,
    user: safeUser,
  });
});

/**
 * GET CURRENT USER
 */
const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

module.exports = {
  signup,
  login,
  me,
};