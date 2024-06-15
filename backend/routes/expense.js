const express = require('express');
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controller/expense');
const { protect } = require('../middleware/auth'); 

const router = express.Router();

router.route('/').get(protect, getExpenses).post(protect, createExpense);
router.route('/:id').put(protect, updateExpense).delete(protect, deleteExpense);

module.exports = router;
