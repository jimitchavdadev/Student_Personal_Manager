const Page = require("../models/Page");
const asyncHandler = require("express-async-handler");

// @desc    Get all pages of a section
// @route   GET /api/pages
const getPages = asyncHandler(async (req, res) => {
  const { sectionId } = req.query;
  if (!sectionId) throw new Error("Section ID is required");

  const pages = await Page.find({ sectionId });
  res.json(pages);
});

// @desc    Create a new page
// @route   POST /api/pages
const createPage = asyncHandler(async (req, res) => {
  const { sectionId, title } = req.body;
  if (!sectionId || !title)
    throw new Error("Section ID, title, and content are required");

  const page = await Page.create({ sectionId: sectionId, title, content: "" });
  res.status(201).json(page);
});

// @desc    Update a page
// @route   PATCH /api/pages/:id
const updatePage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const page = await Page.findByIdAndUpdate(
    id,
    { title, content },
    { new: true, runValidators: true }
  );
  if (!page) {
    res.status(404);
    throw new Error("Page not found");
  }
  res.json(page);
});

// @desc    Delete a page
// @route   DELETE /api/pages/:id
const deletePage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const page = await Page.findById(id);
  if (!page) {
    res.status(404);
    throw new Error("Page not found");
  }

  await page.deleteOne();
  res.json({ message: "Page deleted" });
});

module.exports = {
  getPages,
  createPage,
  updatePage,
  deletePage,
};
