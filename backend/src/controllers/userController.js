const User = require("../models/User");
const { asyncHandler } = require("../middleware/asyncHandler");

// GET /api/users (admin only)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select("name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({ users });
});

module.exports = { getUsers };

