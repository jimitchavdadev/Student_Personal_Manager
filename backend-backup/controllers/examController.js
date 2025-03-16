const Exam = require("../models/Exam");
const asyncHandler = require("express-async-handler");

// @desc    Get all exams for a user
// @route   GET /exams
const getExams = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) throw new Error("User ID is required");

  const exams = await Exam.find({ userId });
  res.json(exams);
});

// @desc    Create a new exam
// @route   POST /exams
const createExam = asyncHandler(async (req, res) => {
  const { userId, ...examData } = req.body;
  if (!userId) throw new Error("User ID is required");

  const exam = await Exam.create({ ...examData, userId });
  res.status(201).json(exam);
});

// @desc    Update an exam
// @route   PATCH /exams/:id
const updateExam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, ...updateData } = req.body;
  if (!userId) throw new Error("User ID is required");

  const exam = await Exam.findOneAndUpdate({ _id: id, userId }, updateData, {
    new: true,
    runValidators: true,
  });

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found or unauthorized");
  }
  res.json(exam);
});

// @desc    Delete an exam
// @route   DELETE /exams/:id
const deleteExam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  if (!userId) throw new Error("User ID is required");

  const exam = await Exam.findOneAndDelete({ _id: id, userId });

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found or unauthorized");
  }
  res.json({ message: "Exam removed" });
});

module.exports = {
  getExams,
  createExam,
  updateExam,
  deleteExam,
};
