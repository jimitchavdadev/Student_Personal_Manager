require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/StudyPro", {  // Change this if using a remote DB
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define Schemas
const notebookSchema = new mongoose.Schema({
    name: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const sectionSchema = new mongoose.Schema({
    notebookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notebook' },
    title: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const pageSchema = new mongoose.Schema({
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Define Models
const Notebook = mongoose.model("Notebook", notebookSchema);
const Section = mongoose.model("Section", sectionSchema);
const Page = mongoose.model("Page", pageSchema);

// Get all notebooks (without sections and pages for better performance)
app.get("/notebooks", async (req, res) => {
    try {
        const notebooks = await Notebook.find();
        res.json(notebooks);
    } catch (error) {
        console.error("Error fetching notebooks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API to fetch a notebook along with sections & pages
app.get("/notebooks/:id", async (req, res) => {
    try {
        const notebookId = req.params.id;

        // Fetch the notebook
        const notebook = await Notebook.findById(notebookId);
        if (!notebook) return res.status(404).json({ error: "Notebook not found" });

        // Fetch sections related to the notebook
        const sections = await Section.find({ notebookId });

        // Fetch pages for each section
        const sectionsWithPages = await Promise.all(
            sections.map(async (section) => {
                const pages = await Page.find({ sectionId: section._id });
                return { 
                    ...section.toObject(), 
                    pages 
                };
            })
        );

        // Return notebook with sections and pages
        res.json({ 
            ...notebook.toObject(), 
            sections: sectionsWithPages 
        });

    } catch (error) {
        console.error("Error fetching notebook:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/notebooks", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Notebook name is required" });

        const now = new Date();
        const newNotebook = new Notebook({ 
            name, 
            createdAt: now, 
            updatedAt: now 
        });
        await newNotebook.save();

        res.status(201).json(newNotebook);
    } catch (error) {
        console.error("Error inserting notebook:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/sections", async (req, res) => {
    try {
        const { notebookId, title } = req.body;
        if (!notebookId || !title) return res.status(400).json({ error: "Notebook ID and section title are required" });

        // Verify notebook exists
        const notebook = await Notebook.findById(notebookId);
        if (!notebook) return res.status(404).json({ error: "Notebook not found" });

        const now = new Date();
        const newSection = new Section({ 
            notebookId, 
            title, 
            createdAt: now, 
            updatedAt: now 
        });
        await newSection.save();

        res.status(201).json(newSection);
    } catch (error) {
        console.error("Error inserting section:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/pages", async (req, res) => {
    try {
        const { sectionId, title, content } = req.body;
        if (!sectionId || !title) return res.status(400).json({ error: "Section ID and title are required" });

        // Verify section exists
        const section = await Section.findById(sectionId);
        if (!section) return res.status(404).json({ error: "Section not found" });

        const now = new Date();
        const newPage = new Page({ 
            sectionId, 
            title, 
            content: content || "", 
            createdAt: now, 
            updatedAt: now 
        });
        await newPage.save();

        res.status(201).json(newPage);
    } catch (error) {
        console.error("Error inserting page:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put("/notebooks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: "Notebook name is required" });

        const updatedNotebook = await Notebook.findByIdAndUpdate(
            id, 
            { name, updatedAt: new Date() }, 
            { new: true }
        );

        if (!updatedNotebook) return res.status(404).json({ error: "Notebook not found" });

        res.json(updatedNotebook);
    } catch (error) {
        console.error("Error updating notebook:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put("/sections/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        if (!title) return res.status(400).json({ error: "Section title is required" });

        const updatedSection = await Section.findByIdAndUpdate(
            id, 
            { title, updatedAt: new Date() }, 
            { new: true }
        );

        if (!updatedSection) return res.status(404).json({ error: "Section not found" });

        res.json(updatedSection);
    } catch (error) {
        console.error("Error updating section:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put("/pages/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title && content === undefined) return res.status(400).json({ error: "Title or content is required" });

        const updateData = {};
        if (title) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        updateData.updatedAt = new Date();

        const updatedPage = await Page.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );

        if (!updatedPage) return res.status(404).json({ error: "Page not found" });

        res.json(updatedPage);
    } catch (error) {
        console.error("Error updating page:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete("/notebooks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find all sections in this notebook
        const sections = await Section.find({ notebookId: id });
        const sectionIds = sections.map(section => section._id);

        // Delete all pages in these sections
        await Page.deleteMany({ sectionId: { $in: sectionIds } });

        // Delete all sections in this notebook
        await Section.deleteMany({ notebookId: id });

        // Delete the notebook
        const deletedNotebook = await Notebook.findByIdAndDelete(id);

        if (!deletedNotebook) return res.status(404).json({ error: "Notebook not found" });

        res.json({ message: "Notebook and its related sections and pages deleted successfully" });
    } catch (error) {
        console.error("Error deleting notebook:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete("/sections/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Delete all pages in this section
        await Page.deleteMany({ sectionId: id });

        // Delete the section
        const deletedSection = await Section.findByIdAndDelete(id);

        if (!deletedSection) return res.status(404).json({ error: "Section not found" });

        res.json({ message: "Section and its pages deleted successfully" });
    } catch (error) {
        console.error("Error deleting section:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete("/pages/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPage = await Page.findByIdAndDelete(id);

        if (!deletedPage) return res.status(404).json({ error: "Page not found" });

        res.json({ message: "Page deleted successfully" });
    } catch (error) {
        console.error("Error deleting page:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));