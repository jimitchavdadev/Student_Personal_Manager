const express = require("express");
const connectDB = require("./config/db");

//Routes Import
const assignmentRoutes = require("./routes/assignmentRoutes");
const examRoutes = require("./routes/examRoutes");
const notebookRoutes = require("./routes/notebookRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const pageRoutes = require("./routes/pageRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

connectDB();

app.use(express.json());

//Routes
app.use("/api/assignments", assignmentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/notebooks", notebookRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/tasks", taskRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

app.listen(5000, () => {
  console.log("server started on port 5000");
});
