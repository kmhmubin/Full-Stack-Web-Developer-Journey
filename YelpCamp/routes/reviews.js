const express = require("express");
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const Campground = require("../models/campground");
const Review = require("../models/review");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

// set up the RESTful route for campground review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
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
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: { _id: reviewId } },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/campgrounds/${id}`);
  })
);

// export the router
module.exports = router;
