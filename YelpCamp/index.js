const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

// import mongoose models
const Campground = require("./models/campground");
const Review = require("./models/review");

// campground router
const campgrounds = require("./routes/campgrounds");
// review router
const reviews = require("./routes/reviews");

const app = express();
const path = require("path");
const { lstat } = require("fs");

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

// use ejs-locals for ejs templates
app.engine("ejs", ejsMate);

// set up the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// url encodeed
app.use(express.urlencoded({ extended: true }));
// override POST method
app.use(methodOverride("_method"));

// use campground router
app.use("/campgrounds", campgrounds);

// use review router
app.use("/campgrounds/:id/reviews", reviews);

// set up the RESTful root route
app.get("/", (req, res) => {
  res.render("index");
});

// url not found
app.all("*", (req, res, next) => {
  next(new ExpressError("Not Found", 404));
});

// error handler
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(status).render("error", { err });
});

// Set up the server
app.listen(3000, () => {
  console.log("Server is running");
});
