const express = require("express");
const {
  getCategory,
  createCategory,
  getExpensesByCategoryId,
  updateCategory,
  deleteCategory,
} = require("../controller/category");

const router = express.Router();

router.route("/").get(getCategory).post(createCategory);
router
  .route("/:id")
  .get(getExpensesByCategoryId)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
