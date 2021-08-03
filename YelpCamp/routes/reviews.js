const express = require("express");
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const Campground = require("../models/campground");
const Review = require("../models/review");

const reviewsController = require("../controllers/reviews");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

// RESTful route pattern for creating review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewsController.createReview)
);

// RESTful route for delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewsController.deleteReview)
);

// export the router
module.exports = router;
