require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/StudyPro', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Assignment Schema
const assignmentSchema = new mongoose.Schema({
  status: String,
  assignment_name: String,
  due_date: Date,
  submit_to: String,
  where_to_submit: String,
  what_to_submit: String,
  how_to_submit: String
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

// API: Get All Assignments
app.get("/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error });
  }
});

// API: Add New Assignment
app.post("/assignments", async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body);
    await newAssignment.save();
    res.status(201).json({ message: "Assignment added successfully", newAssignment });
  } catch (error) {
    res.status(400).json({ message: "Error adding assignment", error });
  }
});

// API: Delete Assignment by ID
app.delete("/assignments/:id", async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json({ message: "Assignment deleted successfully", deletedAssignment });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assignment", error });
  }
});

// API: Update Assignment Status
app.patch("/assignments/:id/status", async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ message: "Status updated successfully", updatedAssignment });
  } catch (error) {
    res.status(400).json({ message: "Error updating status", error });
  }
});

// API: Update Assignment Name
app.patch("/assignments/:id/name", async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { assignment_name: req.body.assignment_name },
      { new: true }
    );
    res.json({ message: "Assignment name updated successfully", updatedAssignment });
  } catch (error) {
    res.status(400).json({ message: "Error updating assignment name", error });
  }
});

// API: Update Due Date
app.patch("/assignments/:id/due_date", async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { due_date: req.body.due_date },
      { new: true }
    );
    res.json({ message: "Due date updated successfully", updatedAssignment });
  } catch (error) {
    res.status(400).json({ message: "Error updating due date", error });
  }
});

// API: Update Submit To
app.patch("/assignments/:id/submit_to", async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { submit_to: req.body.submit_to },
      { new: true }
    );
    res.json({ message: "Submit To updated successfully", updatedAssignment });
  } catch (error) {
    res.status(400).json({ message: "Error updating Submit To", error });
  }
});

// API: Update Where to Submit
app.patch("/assignments/:id/where_to_submit", async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { where_to_submit: req.body.where_to_submit },
      { new: true }
    );
    res.json({ message: "Where to Submit updated successfully", updatedAssignment });
  } catch (error) {
    res.status(400).json({ message: "Error updating Where to Submit", error });
  }
});

// API: Update What to Submit
app.patch("/assignments/:id/what_to_submit", async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { what_to_submit: req.body.what_to_submit },
      { new: true }
    );
    res.json({ message: "What to Submit updated successfully", updatedAssignment });
  } catch (error) {
    res.status(400).json({ message: "Error updating What to Submit", error });
  }
});

// API: Update How to Submit
app.patch("/assignments/:id/how_to_submit", async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { how_to_submit: req.body.how_to_submit },
      { new: true }
    );
    res.json({ message: "How to Submit updated successfully", updatedAssignment });
  } catch (error) {
    res.status(400).json({ message: "Error updating How to Submit", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

