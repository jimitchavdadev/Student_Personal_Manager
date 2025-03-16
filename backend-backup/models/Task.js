const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  step: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
});

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    task_name: { type: String, required: true },
    task_type: { type: String, required: true },
    description: { type: String },
    due_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    subtasks: [subtaskSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
