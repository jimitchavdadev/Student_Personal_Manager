const express = require("express");
const router = express.Router();
const {
  getExams,
  createExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

router.route("/").get(getExams).post(createExam);

router.route("/:id").patch(updateExam).delete(deleteExam);

module.exports = router;
