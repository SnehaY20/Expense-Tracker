const express = require('express');
const {
  getCategory,
  createCategory,
  getExpensesByCategoryId,
  updateCategory,
  deleteCategory,
} = require('../controller/category');
const { protect } = require('../middleware/auth'); 

const router = express.Router();

router.route('/').get(protect, getCategory).post(protect, createCategory);
router
  .route('/:id')
  .get(protect, getExpensesByCategoryId)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
