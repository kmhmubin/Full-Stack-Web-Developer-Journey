const express = require("express");
const passport = require("passport");
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
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registerdUser = await User.register(user, password);
      req.login(registerdUser, (err) => {
        if (err) return next(err);
        req.flash("success", "You have successfully registered");
        res.redirect("/campgrounds");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  })
);

// login route
route.get("/login", (req, res) => {
  res.render("users/login");
});

// login user
route.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "You have successfully logged in");
    const redirect = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect("/campgrounds");
  }
);

// logout route
route.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have successfully logged out");
  res.redirect("/campgrounds");
});

// export route
module.exports = route;
