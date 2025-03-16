const express = require("express");
const router = express.Router();
const {
  getNotebooks,
  getNotebookById,
  createNotebook,
  updateNotebook,
  deleteNotebook,
} = require("../controllers/notebookController");

router.route("/").get(getNotebooks).post(createNotebook);
router
  .route("/:id")
  .get(getNotebookById)
  .patch(updateNotebook)
  .delete(deleteNotebook);

module.exports = router;
