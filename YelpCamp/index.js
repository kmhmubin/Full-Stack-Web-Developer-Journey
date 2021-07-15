const express = require("express");
const mongoose = require("mongoose");
// import mongoose models
const Campground = require("./models/campground");

const app = express();
const path = require("path");

// Connect to database
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Connect to mongoose db
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to mongoDB");
});

// set up the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// set up the root route
app.get("/", (req, res) => {
  res.render("index");
});

// set up the route for campground
app.get("/campground", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// Set up the server
app.listen(3000, () => {
  console.log("Server is running");
});
