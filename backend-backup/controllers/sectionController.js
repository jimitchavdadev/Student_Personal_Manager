const Section = require("../models/Section");
const asyncHandler = require("express-async-handler");

// @desc    Get all sections of a notebook
// @route   GET /api/sections
const getSections = asyncHandler(async (req, res) => {
  const { notebookId } = req.query;
  if (!notebookId) throw new Error("Notebook ID is required");

  const sections = await Section.find({ notebookId });
  res.json(sections);
});

// @desc    Create a new section
// @route   POST /api/sections
const createSection = asyncHandler(async (req, res) => {
  const { notebookId, title } = req.body;
  if (!notebookId || !title)
    throw new Error("Notebook ID and section title are required");

  const section = await Section.create({ notebookId, title });
  res.status(201).json(section);
});

// @desc    Update a section
// @route   PATCH /api/sections/:id
const updateSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const section = await Section.findByIdAndUpdate(
    id,
    { title },
    { new: true, runValidators: true }
  );
  if (!section) {
    res.status(404);
    throw new Error("Section not found");
  }
  res.json(section);
});

// @desc    Delete a section (cascades pages)
// @route   DELETE /api/sections/:id
const deleteSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const section = await Section.findById(id);
  if (!section) {
    res.status(404);
    throw new Error("Section not found");
  }

  await section.deleteOne();
  res.json({ message: "Section and its pages deleted" });
});

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection,
};
