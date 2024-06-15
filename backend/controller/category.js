const path = require("path");
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// GET all category
exports.getCategory = asyncHandler(async (req, res, next) => {
  let categories;
  if (req.user.role === "admin") {
    categories = await Category.find().populate({
      path: "user",
      select: "name",
    });
  } else {
    categories = await Category.find();
  }
  res
    .status(200)
    .json({ count: categories.length, success: true, data: categories });
});

// desc     POST create new category
// route    POST /api/v1/category
// access   private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // Check if category already exists
  let category = await Category.findOne({
    name: { $regex: new RegExp(name, "i") },
  });

  if (category) {
    return res
      .status(400)
      .json({ success: false, message: "Category already exists" });
  }
  category = await Category.create({ name, user: req.user._id });

  res.status(201).json({ success: true, data: category });
});

// desc     GET expenses by category id
// route    GET /api/v1/category/:id
// access   private
exports.getExpensesByCategoryId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const expenses = await Expense.find({ category: id }).populate(
    "category",
    "name"
  );

  if (!expenses || expenses.length === 0) {
    return res
      .status(404)
      .json({
        success: false,
        message: `No expenses found for category with ID ${id}`,
      });
  }

  res.status(200).json({ count: expenses.length, success: true, data: expenses });
});

// desc     PUT update category by category id
// route    PUT /api/v1/category/:id
// access   private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedCategory) {
    return res
      .status(404)
      .json({ success: false, message: `Category with ID ${id} not found` });
  }

  res.status(200).json({ success: true, data: updatedCategory });
});

// desc     DELETE category by categpory id
// route    GET /api/v1/category/:id
// access   private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id);

  if (!deletedCategory) {
    return res
      .status(404)
      .json({ success: false, message: `Category with ID ${id} not found` });
  }

  res.status(200).json({ success: true, message: "Category deleted" });
});
