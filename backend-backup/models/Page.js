const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    content: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", pageSchema);
