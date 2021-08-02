const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login");
  }
  next();
};

// Middleware to check validtation for the campground

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Middleware to check if the user is the owner of the campground
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit this campground.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
