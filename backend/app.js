const express = require("express");
const app = express();

app.use(express.json());

const errorMiddleware = require("./middlewares/error");

// Route imports
const products = require("./routes/productRoute");

app.use("/api/v1", products)

// middleware for error
app.use(errorMiddleware);

module.exports = app;