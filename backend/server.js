const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger.js");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error.js");
const connectDB = require("./config/db.js");

// Load env variables
dotenv.config({ path: "./.env" });

// Connect to MongoDB
connectDB();

// Bring in Route files
const expense = require("./routes/expense");
const category = require("./routes/category");
const auth = require("./routes/auth");

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(logger);
}

// Mount routers (path)
app.use("/api/v1/expenses", expense);
app.use("/api/v1/category", category);
app.use("/api/v1/auth", auth);

app.use(errorHandler); // it needs to be below the above route else won't catch any error

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  PORT,
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
});
