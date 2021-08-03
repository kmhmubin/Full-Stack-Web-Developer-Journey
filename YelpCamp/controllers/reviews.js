const Campground = require("../models/campground");
const Review = require("../models/review");

// controller for new review
module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = await Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Review created");
  res.redirect(`/campgrounds/${campground._id}`);
};

// controller for delete review
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: { _id: reviewId } },
  });
  await Review.findByIdAndRemove(reviewId);
  req.flash("success", "Review deleted");
  res.redirect(`/campgrounds/${id}`);
};
