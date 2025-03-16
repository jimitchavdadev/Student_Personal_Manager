const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    assignment_name: {
      type: String,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    submit_to: {
      type: String,
      required: true,
    },
    where_to_submit: {
      type: String,
      required: true,
    },
    what_to_submit: {
      type: String,
      required: true,
    },
    how_to_submit: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
