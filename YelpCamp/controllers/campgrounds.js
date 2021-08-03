const Campground = require("../models/campground");

// controller for campgrounds index page
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

// controller for new campground page
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

// controller for create new campground
module.exports.createCampground = async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Campground created!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// controller for show campground page
module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

// controller for edit campground page
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

// controller for update campground
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Campground updated!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// controller for delete campground
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndRemove(id);
  req.flash("success", "Campground deleted!");
  res.redirect("/campgrounds");
};