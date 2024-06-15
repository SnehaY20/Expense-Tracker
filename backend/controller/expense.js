const path = require("path");
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// GET all expenses
exports.getExpenses = asyncHandler(async (req, res, next) => {
  let expenses;
  if (req.user.role === "admin") {
    expenses = await Expense.find()
      .populate({ path: "category", select: "name" })
      .populate({ path: "user", select: "name" });
  } else {
    expenses = await Expense.find({ user: req.user.id }).populate({
      path: "category",
      select: "name",
    });
  }
  res
    .status(200)
    .json({ count: expenses.length, success: true, data: expenses });
});

// desc     POST create new expense
// route    POST /api/v1/expenses
// access   private
exports.createExpense = asyncHandler(async (req, res, next) => {
  const { description, amount, category, note } = req.body;

  // Add user ID to the req.body
  // req.body.user = req.user._id;

  // Find or create the category ObjectId based on its name
  let categoryObj = await Category.findOne({
    name: { $regex: new RegExp(category, "i") },
  });

  if (!categoryObj) {
    categoryObj = await Category.create({ name: category, user: req.user._id});
  }

  const newExpense = await Expense.create({
    description,
    amount,
    category: categoryObj._id,
    note,
    user: req.user._id, 
  });

  console.log()
  res.status(201).json({ success: true, data: newExpense });
});

// desc     PUT update expense details by object id
// route    PUT /api/v1/expenses/:id
// access   private
exports.updateExpense = asyncHandler(async (req, res, next) => {
  // Extract the 'id' parameter from the URL
  const { id } = req.params;

  // Check if the expense belongs to the logged-in user
  const expense = await Expense.findById(id);
  if (!expense || expense.user.toString() !== req.user.id) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Not authorized to update this expense",
      });
  }

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

  // Check if the expense belongs to the logged-in user
  const expense = await Expense.findById(id);
  if (!expense || expense.user.toString() !== req.user.id) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Not authorized to delete this expense",
      });
  }

  const deletedExpense = await Expense.findByIdAndDelete(id);

  if (!deletedExpense) {
    return res
      .status(404)
      .json({ success: false, message: `Expense with ID ${id} not found` });
  }

  res.status(200).json({ success: true, message: "Expense deleted" });
});
