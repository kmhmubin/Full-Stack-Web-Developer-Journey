const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

// import product model
const Product = require("./models/product");

// Database connection
mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("index nigga");
});

// app listen port 3000
app.listen(3000, () => {
  console.log("app listen port 3000");
});
