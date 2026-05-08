const express = require("express");
const healthRoutes = require("./healthRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/users", userRoutes);

module.exports = router;

