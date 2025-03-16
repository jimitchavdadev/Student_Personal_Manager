const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    notebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

// Cascade delete pages when a section is deleted
sectionSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const Page = mongoose.model("Page");
    await Page.deleteMany({ sectionId: this._id });
    next();
  }
);

module.exports = mongoose.model("Section", sectionSchema);
