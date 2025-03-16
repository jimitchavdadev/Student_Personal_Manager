const express = require("express");
const router = express.Router();
const {
  getSections,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");

router.route("/").get(getSections).post(createSection);
router.route("/:id").patch(updateSection).delete(deleteSection);

module.exports = router;
