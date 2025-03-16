const Notebook = require("../models/Notebook");
const asyncHandler = require("express-async-handler");

// @desc    Get all notebooks for a user
// @route   GET /api/notebooks
const getNotebooks = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) throw new Error("User ID is required");

  const notebooks = await Notebook.find({ userId });
  res.json(notebooks);
});

// @desc    Get a single notebook by ID
// @route   GET /api/notebooks/:id
const getNotebookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notebook = await Notebook.findById(id);
  if (!notebook) {
    res.status(404);
    throw new Error("Notebook not found");
  }
  res.json(notebook);
});

// @desc    Create a new notebook
// @route   POST /api/notebooks
const createNotebook = asyncHandler(async (req, res) => {
  const { userId, name } = req.body;
  if (!userId || !name)
    throw new Error("User ID and notebook name are required");

  const notebook = await Notebook.create({ userId, name });
  res.status(201).json(notebook);
});

// @desc    Update a notebook
// @route   PATCH /api/notebooks/:id
const updateNotebook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, name } = req.body;
  if (!userId) throw new Error("User ID is required");

  const notebook = await Notebook.findOneAndUpdate(
    { _id: id, userId },
    { name },
    { new: true, runValidators: true }
  );
  if (!notebook) {
    res.status(404);
    throw new Error("Notebook not found or unauthorized");
  }
  res.json(notebook);
});

// @desc    Delete a notebook (cascades sections and pages)
// @route   DELETE /api/notebooks/:id
const deleteNotebook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  if (!userId) throw new Error("User ID is required");

  const notebook = await Notebook.findOne({ _id: id, userId });
  if (!notebook) {
    res.status(404);
    throw new Error("Notebook not found or unauthorized");
  }

  await notebook.deleteOne();
  res.json({ message: "Notebook and its sections & pages deleted" });
});

module.exports = {
  getNotebooks,
  getNotebookById,
  createNotebook,
  updateNotebook,
  deleteNotebook,
};
