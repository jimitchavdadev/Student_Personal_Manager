const Task = require("../models/Task");
const asyncHandler = require("express-async-handler");

// @desc    Get all tasks for a user
// @route   GET /api/tasks
const getTasks = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  const tasks = await Task.find({ userId });
  res.json(tasks);
});

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { userId, task_name, task_type, due_date, description } = req.body;
  if (!userId || !task_name || !task_type || !due_date) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  const newTask = await Task.create({
    userId,
    task_name,
    task_type,
    due_date,
    description,
    status: "pending",
  });

  res.status(201).json(newTask);
});

// @desc    Update a task
// @route   PATCH /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, ...updateData } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  const task = await Task.findOneAndUpdate({ _id: id, userId }, updateData, {
    new: true,
    runValidators: true,
  });

  if (!task)
    return res.status(404).json({ error: "Task not found or unauthorized" });

  res.json(task);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  const task = await Task.findOneAndDelete({ _id: id, userId });
  if (!task)
    return res.status(404).json({ error: "Task not found or unauthorized" });

  res.json({ message: "Task deleted successfully" });
});

// @desc    Add a subtask
// @route   POST /api/tasks/:id/subtasks
const addSubtask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { step, status } = req.body;

  if (!step)
    return res.status(400).json({ error: "Subtask 'step' is required" });

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.subtasks.push({ step, status: status || "pending" });
  await task.save();

  res.json({ message: "Subtask added successfully", task });
});

// @desc    Update a subtask
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
const updateSubtask = asyncHandler(async (req, res) => {
  const { id, subtaskId } = req.params;
  const { step, status } = req.body;

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const subtask = task.subtasks.id(subtaskId);
  if (!subtask) return res.status(404).json({ error: "Subtask not found" });

  if (step) subtask.step = step;
  if (status) subtask.status = status;

  await task.save();
  res.json({ message: "Subtask updated successfully", task });
});

// @desc    Delete a subtask
// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
const deleteSubtask = asyncHandler(async (req, res) => {
  const { id, subtaskId } = req.params;

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.subtasks = task.subtasks.filter(
    (sub) => sub._id.toString() !== subtaskId
  );
  await task.save();

  res.json({ message: "Subtask deleted successfully", task });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
};
