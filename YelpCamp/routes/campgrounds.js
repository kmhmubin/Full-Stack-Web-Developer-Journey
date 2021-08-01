const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const methodOverride = require("method-override");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas.js");

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

// set up the RESTful route for campground
router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// set up the RESTful route for new campground
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// set up the RESTful route for new campground post
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Campground created!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// set up the RESTful route for campground show
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
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
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// set up the RESTful route for campground update
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      {
        new: true,
      }
    );
    req.flash("success", "Campground updated!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// set up the RESTful route for campground delete
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Campground deleted!");
    res.redirect("/campgrounds");
  })
);

// export the router
module.exports = router;
