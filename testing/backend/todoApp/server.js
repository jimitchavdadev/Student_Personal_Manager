require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(mongoURI);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("StudyPro"); // ✅ Changed from "todoDB" to "StudyPro"
        console.log("Connected to MongoDB - StudyPro");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

connectDB();

// ----------------------------
// 1. Fetch All Tasks
// ----------------------------
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await db.collection("tasks").find().toArray();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
});

// ----------------------------
// 2. Update Task Details
// ----------------------------
app.put("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { status, task_name, task_type, due_date, description } = req.body;

    try {
        const updatedTask = await db.collection("tasks").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...(status && { status }),
                    ...(task_name && { task_name }),
                    ...(task_type && { task_type }),
                    ...(due_date && { due_date: new Date(due_date) }),
                    ...(description && { description }),
                },
            }
        );

        if (updatedTask.modifiedCount === 0) {
            return res.status(404).json({ error: "Task not found or no changes made" });
        }

        res.json({ message: "Task updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating task" });
    }
});

// ----------------------------
// 3. Add a New Substep
// ----------------------------
app.post("/api/tasks/:id/substeps", async (req, res) => {
    const { id } = req.params;
    const { step, completed } = req.body;

    if (!step) {
        return res.status(400).json({ error: "Substep 'step' field is required" });
    }

    try {
        const updatedTask = await db.collection("tasks").updateOne(
            { _id: new ObjectId(id) },
            { $push: { substeps: { step, completed: completed || false } } }
        );

        if (updatedTask.modifiedCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Substep added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding substep" });
    }
});

// ----------------------------
// 4. Update an Existing Substep
// ----------------------------
app.put("/api/tasks/:id/substeps/:substepIndex", async (req, res) => {
    const { id, substepIndex } = req.params;
    const { step, completed } = req.body;

    try {
        const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) });

        if (!task || !task.substeps || task.substeps.length <= substepIndex) {
            return res.status(404).json({ error: "Task or substep not found" });
        }

        const updateField = {};
        if (step) updateField[`substeps.${substepIndex}.step`] = step;
        if (completed !== undefined) updateField[`substeps.${substepIndex}.completed`] = completed;

        const updatedTask = await db.collection("tasks").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateField }
        );

        res.json({ message: "Substep updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating substep" });
    }
});

// ----------------------------
// 5. Remove a Substep
// ----------------------------
app.delete("/api/tasks/:id/substeps/:substepIndex", async (req, res) => {
    const { id, substepIndex } = req.params;

    try {
        const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) });

        if (!task || !task.substeps || task.substeps.length <= substepIndex) {
            return res.status(404).json({ error: "Task or substep not found" });
        }

        task.substeps.splice(substepIndex, 1); // Remove substep

        const updatedTask = await db.collection("tasks").updateOne(
            { _id: new ObjectId(id) },
            { $set: { substeps: task.substeps } }
        );

        res.json({ message: "Substep removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error removing substep" });
    }
});

// ----------------------------
// 6. Start the Server
// ----------------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// ----------------------------
// 7. Delete a Whole Task
// ----------------------------
app.delete("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });

        if (deletedTask.deletedCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting task" });
    }
});

// ----------------------------
// 8. Create a New Task
// ----------------------------
app.post("/api/tasks", async (req, res) => {
    const { task_name, task_type, due_date, description, status } = req.body;

    if (!task_name) {
        return res.status(400).json({ error: "Task name is required" });
    }

    try {
        const newTask = {
            task_name,
            task_type: task_type || "General",
            due_date: due_date ? new Date(due_date) : null,
            description: description || "",
            status: status || "pending",
            substeps: [],
            created_at: new Date()
        };

        const result = await db.collection("tasks").insertOne(newTask);
        
        res.status(201).json({ 
            _id: result.insertedId,
            ...newTask
        });
    } catch (error) {
        res.status(500).json({ error: "Error creating task" });
    }
});

// ----------------------------
// 9. Get a Single Task
// ----------------------------
app.get("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) });
        
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error fetching task" });
    }
});
