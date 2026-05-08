const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const { asyncHandler } = require("../middleware/asyncHandler");

const STATUS_VALUES = ["Todo", "In Progress", "Done"];

/**
 * =========================
 * HELPERS (RBAC CLEANUP)
 * =========================
 */
function isAdmin(user) {
  return user.role === "admin";
}

function isSelf(user, targetId) {
  return String(user._id) === String(targetId);
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value));
}

function taskPopulate(query) {
  return query
    .populate("projectId", "title description createdBy members")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role");
}

async function ensureProjectAccessOrThrow({ projectId, user }) {
  const project = await Project.findById(projectId).select("createdBy members");
  if (!project) {
    const err = new Error("Project not found");
    err.statusCode = 404;
    throw err;
  }

  if (isAdmin(user)) return project;

  const isCreator = String(project.createdBy) === String(user._id);
  const isMember = (project.members || []).some(
    (m) => String(m) === String(user._id)
  );

  if (!isCreator && !isMember) {
    const err = new Error("Not authorized to access this project");
    err.statusCode = 403;
    throw err;
  }

  return project;
}

/**
 * =========================
 * CREATE TASK (ADMIN ONLY)
 * =========================
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, projectId, status, dueDate } =
    req.body || {};

  if (!title || String(title).trim().length < 2) {
    res.status(400);
    throw new Error("Title is required (min 2 chars)");
  }

  if (!assignedTo || !isValidObjectId(assignedTo)) {
    res.status(400);
    throw new Error("assignedTo must be valid user id");
  }

  if (!projectId || !isValidObjectId(projectId)) {
    res.status(400);
    throw new Error("projectId must be valid project id");
  }

  if (status && !STATUS_VALUES.includes(String(status))) {
    res.status(400);
    throw new Error(`status must be one of: ${STATUS_VALUES.join(", ")}`);
  }

  const [user, project] = await Promise.all([
    User.findById(assignedTo).select("_id"),
    Project.findById(projectId).select("_id"),
  ]);

  if (!user) {
    res.status(400);
    throw new Error("assignedTo user not found");
  }

  if (!project) {
    res.status(400);
    throw new Error("project not found");
  }

  let parsedDueDate = null;
  if (dueDate) {
    const d = new Date(dueDate);
    if (Number.isNaN(d.getTime())) {
      res.status(400);
      throw new Error("dueDate must be valid date");
    }
    parsedDueDate = d;
  }

  const task = await Task.create({
    title: String(title).trim(),
    description: description ? String(description).trim() : "",
    assignedTo: user._id,
    projectId: project._id,
    createdBy: req.user._id,
    status: status || "Todo",
    dueDate: parsedDueDate,
  });

  const populated = await taskPopulate(Task.findById(task._id));
  res.status(201).json({ task: populated });
});

/**
 * =========================
 * GET TASKS
 * =========================
 */
const getTasks = asyncHandler(async (req, res) => {
  const filter = isAdmin(req.user)
    ? {}
    : { assignedTo: req.user._id };

  const tasks = await taskPopulate(
    Task.find(filter).sort({ createdAt: -1 })
  );

  res.status(200).json({ tasks });
});

/**
 * =========================
 * GET TASK BY ID
 * =========================
 */
const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  const task = await taskPopulate(Task.findById(id));

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (!isAdmin(req.user) && !isSelf(req.user, task.assignedTo?._id || task.assignedTo)) {
    res.status(403);
    throw new Error("Not authorized to access this task");
  }

  res.status(200).json({ task });
});

/**
 * =========================
 * UPDATE TASK STATUS
 * =========================
 */
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  const { status } = req.body || {};

  if (!status || !STATUS_VALUES.includes(String(status))) {
    res.status(400);
    throw new Error(`status must be one of: ${STATUS_VALUES.join(", ")}`);
  }

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (!isAdmin(req.user) && !isSelf(req.user, task.assignedTo)) {
    res.status(403);
    throw new Error("Only assignee or admin can update task");
  }

  task.status = String(status);
  await task.save();

  const populated = await taskPopulate(Task.findById(task._id));
  res.status(200).json({ task: populated });
});

/**
 
 * GET TASKS BY PROJECT
 
 */
const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!isValidObjectId(projectId)) {
    res.status(400);
    throw new Error("Invalid project id");
  }

  await ensureProjectAccessOrThrow({
    projectId,
    user: req.user,
  });

  const tasks = await taskPopulate(
    Task.find(
      isAdmin(req.user)
        ? { projectId }
        : { projectId, assignedTo: req.user._id }
    ).sort({ createdAt: -1 })
  );

  res.status(200).json({ tasks });
});

/**
 
 * GET TASKS BY USER

 */
const getTasksByAssignedUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    res.status(400);
    throw new Error("Invalid user id");
  }

  if (!isAdmin(req.user) && !isSelf(req.user, userId)) {
    res.status(403);
    throw new Error("Not authorized to view these tasks");
  }

  const tasks = await taskPopulate(
    Task.find({ assignedTo: userId }).sort({ createdAt: -1 })
  );

  res.status(200).json({ tasks });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
  getTasksByProject,
  getTasksByAssignedUser,
};