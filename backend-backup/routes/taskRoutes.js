const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
} = require("../controllers/taskController");

const router = express.Router();

router.route("/").get(getTasks).post(createTask);
router.route("/:id").patch(updateTask).delete(deleteTask);

router.route("/:id/subtasks").post(addSubtask);
router
  .route("/:id/subtasks/:subtaskId")
  .patch(updateSubtask)
  .delete(deleteSubtask);

module.exports = router;
