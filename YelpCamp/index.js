const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

// use ejs-locals for ejs templates
app.engine("ejs", ejsMate);

// set up the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// url encodeed
app.use(express.urlencoded({ extended: true }));
// override POST method
app.use(methodOverride("_method"));

// set up the RESTful root route
app.get("/", (req, res) => {
  res.render("index");
});

// set up the RESTful route for campground
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// set up the RESTful route for new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// set up the RESTful route for new campground post
app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// set up the RESTful route for campground show
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

// set up the RESTful route for campground edit
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

// set up the RESTful route for campground update
app.put("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    {
      new: true,
    }
  );
  res.redirect(`/campgrounds/${campground._id}`);
});

// set up the RESTful route for campground delete
app.delete("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
});

// Set up the server
app.listen(3000, () => {
  console.log("Server is running");
});
