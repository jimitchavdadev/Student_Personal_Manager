const mongoose = require("mongoose");

const notebookSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// Cascade delete sections and pages when a notebook is deleted
notebookSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const Section = mongoose.model("Section");
    const Page = mongoose.model("Page");

    const sections = await Section.find({ notebookId: this._id });

    for (const section of sections) {
      await Page.deleteMany({ sectionId: section._id });
    }

    await Section.deleteMany({ notebookId: this._id });

    next();
  }
);

module.exports = mongoose.model("Notebook", notebookSchema);
