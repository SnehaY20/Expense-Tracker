const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category can not be null"],
    unique: true,
  },
});

module.exports = mongoose.model("Category", CategorySchema);
