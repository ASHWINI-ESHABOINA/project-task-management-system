const express = require("express");
const { getUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.get("/", protect, isAdmin, getUsers);

module.exports = router;

