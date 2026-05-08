const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");
const { asyncHandler } = require("../middleware/asyncHandler");

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value));
}

function toObjectIdStrings(values) {
  const arr = Array.isArray(values) ? values : [];
  return [...new Set(arr.map((v) => String(v)).filter(Boolean))];
}

function projectPopulate(query) {
  return query
    .populate("createdBy", "name email role")
    .populate("members", "name email role");
}

// POST /api/projects (admin only)
const createProject = asyncHandler(async (req, res) => {
  const { title, description, members } = req.body || {};

  if (!title || String(title).trim().length < 2) {
    res.status(400);
    throw new Error("Title is required (min 2 chars)");
  }

  const memberIds = toObjectIdStrings(members).filter(isValidObjectId);

  let validMemberIds = [];
  if (memberIds.length > 0) {
    const users = await User.find({ _id: { $in: memberIds } }).select("_id");
    validMemberIds = users.map((u) => u._id);
  }

  const project = await Project.create({
    title: String(title).trim(),
    description: description ? String(description).trim() : "",
    createdBy: req.user._id,
    members: validMemberIds,
  });

  const populated = await projectPopulate(Project.findById(project._id));
  res.status(201).json({ project: populated });
});

// GET /api/projects (protected)
const getProjects = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "admin"
      ? {}
      : { $or: [{ createdBy: req.user._id }, { members: req.user._id }] };

  const projects = await projectPopulate(
    Project.find(filter).sort({ createdAt: -1 })
  );

  res.status(200).json({ projects });
});

// GET /api/projects/:id (protected)
const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid project id");
  }

  const project = await projectPopulate(Project.findById(id));
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isAdmin = req.user.role === "admin";
  const isCreator = String(project.createdBy?._id || project.createdBy) === String(req.user._id);
  const isMember = (project.members || []).some((m) => String(m?._id || m) === String(req.user._id));

  if (!isAdmin && !isCreator && !isMember) {
    res.status(403);
    throw new Error("Not authorized to access this project");
  }

  res.status(200).json({ project });
});

// POST /api/projects/:id/members (protected; admin or creator)
// body: { members: [userId, ...] }
const addMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid project id");
  }

  const incoming = req.body?.members;
  if (!Array.isArray(incoming) || incoming.length === 0) {
    res.status(400);
    throw new Error("members must be a non-empty array of user ids");
  }

  const memberIds = toObjectIdStrings(incoming);
  const invalidIds = memberIds.filter((m) => !isValidObjectId(m));
  if (invalidIds.length > 0) {
    res.status(400);
    throw new Error("members contains invalid user id(s)");
  }

  const project = await Project.findById(id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isAdmin = req.user.role === "admin";
  const isCreator = String(project.createdBy) === String(req.user._id);
  if (!isAdmin && !isCreator) {
    res.status(403);
    throw new Error("Not authorized to add members to this project");
  }

  const users = await User.find({ _id: { $in: memberIds } }).select("_id");
  const validUserIds = users.map((u) => u._id);
  if (validUserIds.length === 0) {
    res.status(400);
    throw new Error("No valid users found to add");
  }

  await Project.updateOne(
    { _id: project._id },
    { $addToSet: { members: { $each: validUserIds } } }
  );

  const updated = await projectPopulate(Project.findById(project._id));
  res.status(200).json({ project: updated });
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  addMembers,
};

