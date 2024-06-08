const path = require("path");
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");

// desc     GET all expenses
// route    GET /api/v1/expenses
// access   private
exports.getExpenses = asyncHandler(async (req, res, next) => {
  const expenses = await Expense.find().populate("category", "name");
  res.status(200).json({ success: true, data: expenses });
});

// desc     POST create new expense
// route    POST /api/v1/expenses
// access   private
exports.createExpense = asyncHandler(async (req, res, next) => {
  const { description, amount, category, note, user } = req.body;

  console.log("Request Body:", req.body);

  // Find or create the category ObjectId based on its name
  let categoryObj = await Category.findOne({
    name: { $regex: new RegExp(category, "i") },
  });
  console.log("Category Object:", categoryObj);

  if (!categoryObj) {
    categoryObj = await Category.create({ name: category });
    console.log("Created New Category:", categoryObj);
  }

  const newExpense = await Expense.create({
    description,
    amount,
    category: categoryObj._id,
    note,
    user,
  });
  console.log("New Expense:", newExpense);

  res.status(201).json({ success: true, data: newExpense });
});

// desc     PUT update expense details by object id
// route    PUT /api/v1/expenses/:id
// access   private
exports.updateExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedExpense) {
    return res
      .status(404)
      .json({ success: false, message: `Expense with ID ${id} not found` });
  }

  res.status(200).json({ success: true, data: updatedExpense });
});

// desc     DELETE  expense by object id
// route    DELETE /api/v1/expenses/:id
// access   private
exports.deleteExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedExpense = await Expense.findByIdAndDelete(id);

  if (!deletedExpense) {
    return res
      .status(404)
      .json({ success: false, message: `Expense with ID ${id} not found` });
  }

  res.status(200).json({ success: true, message: "Expense deleted" });
});
