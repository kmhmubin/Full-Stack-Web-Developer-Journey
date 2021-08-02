const express = require("express");
const route = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

// register route
route.get("/register", (req, res) => {
  res.render("users/register");
});

// register new user
route.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registerdUser = await User.register(user, password);
      console.log(registerdUser);
      req.flash("success", "You have successfully registered");
      res.redirect("/campgrounds");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  })
);

// export route
module.exports = route;
