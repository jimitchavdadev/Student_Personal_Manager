require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Log MongoDB URI (remove sensitive parts for security)
console.log("Connecting to MongoDB with URI:", process.env.MONGO_URI ? "URI provided" : "URI missing");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB Connected");
  // Log the database name and available collections
  mongoose.connection.db.listCollections().toArray()
    .then(collections => {
      console.log("Available collections:", collections.map(c => c.name));
    })
    .catch(err => console.error("Error listing collections:", err));
})
.catch(err => console.error("MongoDB Connection Error:", err));

// Exam Schema
const examSchema = new mongoose.Schema({
  subject_name: String,
  exam_date: Date,
  what_to_study: String,
  resources: [String]
}, { collection: 'exams' }); // Explicitly specify the collection name

// Use the explicit collection name approach
const Exam = mongoose.model("Exam", examSchema);

// API: Get All Exams
app.get("/exams", async (req, res) => {
  try {
    console.log("Attempting to fetch exams...");
    const exams = await Exam.find();
    console.log("Exams found:", exams.length);
    res.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ message: "Error fetching exams", error });
  }
});

// API: Add New Exam
app.post("/exams", async (req, res) => {
  try {
    const newExam = new Exam(req.body);
    await newExam.save();
    res.status(201).json({ message: "Exam added successfully", newExam });
  } catch (error) {
    res.status(400).json({ message: "Error adding exam", error });
  }
});

// API: Delete Exam by ID
app.delete("/exams/:id", async (req, res) => {
  try {
    const deletedExam = await Exam.findByIdAndDelete(req.params.id);
    if (!deletedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json({ message: "Exam deleted successfully", deletedExam });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exam", error });
  }
});

// API: Update Exam Subject Name
app.patch("/exams/:id/subject_name", async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      { subject_name: req.body.subject_name },
      { new: true }
    );
    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json({ message: "Subject name updated successfully", updatedExam });
  } catch (error) {
    res.status(400).json({ message: "Error updating subject name", error });
  }
});

// API: Update Exam Date
app.patch("/exams/:id/exam_date", async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      { exam_date: req.body.exam_date },
      { new: true }
    );
    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json({ message: "Exam date updated successfully", updatedExam });
  } catch (error) {
    res.status(400).json({ message: "Error updating exam date", error });
  }
});

// API: Update What to Study
app.patch("/exams/:id/what_to_study", async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      { what_to_study: req.body.what_to_study },
      { new: true }
    );
    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json({ message: "What to study updated successfully", updatedExam });
  } catch (error) {
    res.status(400).json({ message: "Error updating what to study", error });
  }
});

// API: Update Resources
app.patch("/exams/:id/resources", async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      { resources: req.body.resources },
      { new: true }
    );
    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json({ message: "Resources updated successfully", updatedExam });
  } catch (error) {
    res.status(400).json({ message: "Error updating resources", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
