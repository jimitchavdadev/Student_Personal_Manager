const express = require("express");
const router = express.Router();
const {
  getPages,
  createPage,
  updatePage,
  deletePage,
} = require("../controllers/pageController");

router.route("/").get(getPages).post(createPage);
router.route("/:id").patch(updatePage).delete(deletePage);

module.exports = router;
