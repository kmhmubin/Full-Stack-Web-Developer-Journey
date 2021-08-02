const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

const Campground = require("../models/campground");

// set up the RESTful route for campground
router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// set up the RESTful route for new campground
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// set up the RESTful route for new campground post
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Campground created!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// set up the RESTful route for campground show
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    if (!campground) {
      req.flash("error", "Campground not found!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

// set up the RESTful route for campground edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Campground not found!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

// set up the RESTful route for campground update
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Campground updated!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// set up the RESTful route for campground delete
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground deleted!");
    res.redirect("/campgrounds");
  })
);

// export the router
module.exports = router;
