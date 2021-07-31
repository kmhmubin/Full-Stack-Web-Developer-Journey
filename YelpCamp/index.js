const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
// import mongoose models
const Campground = require("./models/campground");
const Review = require("./models/review");

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

// backend middleware Campground form validation
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// backend middleware Review form validation
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// set up the RESTful route for campground show
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campgrounds/show", { campground });
  })
);

// set up the RESTful route for campground edit
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// set up the RESTful route for campground update
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      {
        new: true,
      }
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// set up the RESTful route for campground delete
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

// set up the RESTful route for campground review
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// set up the RESTful route for campground review delete
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    campground.reviews.pull(review);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

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
