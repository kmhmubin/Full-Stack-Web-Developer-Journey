const express = require("express");
const router = express.Router();

const campgroundsController = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

const Campground = require("../models/campground");

// set up the RESTful route for campground and new campground using the campgrounds controller
router
  .route("/")
  .get(catchAsync(campgroundsController.index))
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campgroundsController.createCampground)
  );

// RESTFul router for new campground
router.get("/new", isLoggedIn, catchAsync(campgroundsController.renderNewForm));

// RESTful route for show, update, and delete campgrounds
router
  .route("/:id")
  .get(catchAsync(campgroundsController.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgroundsController.updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundsController.deleteCampground)
  );

// RESTful route for edit campgrounds
router.get(
  ":/id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundsController.renderEditForm)
);

// export the router
module.exports = router;
