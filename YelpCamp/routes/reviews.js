const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Review = require("../models/review");

const { reviewSchema } = require("../schemas.js");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

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

// set up the RESTful route for campground review
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review created!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// set up the RESTful route for campground review delete
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    campground.reviews.pull(review);
    await campground.save();
    req.flash("success", "Review deleted!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// export the router
module.exports = router;
