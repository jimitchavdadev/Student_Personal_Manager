const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    subject_name: {
      type: String,
      required: true,
    },
    exam_date: {
      type: Date,
      required: true,
    },
    what_to_study: {
      type: String,
    },
    resources: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
