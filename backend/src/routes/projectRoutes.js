const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  addMembers,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.use(protect);

router.route("/").get(getProjects).post(isAdmin, createProject);

router.get("/:id", getProjectById);
router.post("/:id/members", addMembers);

module.exports = router;

