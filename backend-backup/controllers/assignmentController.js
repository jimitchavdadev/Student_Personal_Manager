const Assignment = require("../models/Assignment");
const asyncHandler = require("express-async-handler");

// @desc    Get all assignments for a user
// @route   GET /assignments
const getAssignments = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) throw new Error("User ID is required");

  const assignments = await Assignment.find({ userId });
  res.json(assignments);
});

// @desc    Create new assignment
// @route   POST /assignments
const createAssignment = asyncHandler(async (req, res) => {
  const { userId, ...assignmentData } = req.body;
  if (!userId) throw new Error("User ID is required");

  const assignment = await Assignment.create({ ...assignmentData, userId });
  res.status(201).json(assignment);
});

// @desc    Update assignment
// @route   PATCH /assignments/:id
const updateAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, ...updateData } = req.body;
  if (!userId) throw new Error("User ID is required");

  const assignment = await Assignment.findOneAndUpdate(
    { _id: id, userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found or unauthorized");
  }
  res.json(assignment);
});

// @desc    Delete assignment
// @route   DELETE /assignments/:id
const deleteAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  if (!userId) throw new Error("User ID is required");

  const assignment = await Assignment.findOneAndDelete({ _id: id, userId });

  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found or unauthorized");
  }
  res.json({ message: "Assignment removed" });
});

module.exports = {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
