const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
  getTasksByProject,
  getTasksByAssignedUser,
} = require("../controllers/taskController");

const router = express.Router();

/**
 * Apply authentication to all routes
 */
router.use(protect);

/**
 * GET ALL + CREATE TASK
 */
router
  .route("/")
  .get(authorizeRoles("admin", "member"), getTasks)
  .post(authorizeRoles("admin"), createTask);

/**
 * PROJECT TASKS
 */
router.get(
  "/project/:projectId",
  authorizeRoles("admin", "member"),
  getTasksByProject
);

/**
 * ASSIGNED USER TASKS
 */
router.get(
  "/assigned/:userId",
  authorizeRoles("admin", "member"),
  getTasksByAssignedUser
);

/**
 * SINGLE TASK
 */
router.get(
  "/:id",
  authorizeRoles("admin", "member"),
  getTaskById
);

/**
 * UPDATE STATUS
 */
router.patch(
  "/:id/status",
  authorizeRoles("admin", "member"),
  updateTaskStatus
);

module.exports = router;