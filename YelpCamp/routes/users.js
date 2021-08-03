const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const userController = require("../controllers/users");

// RESTful route for registering a new user
router
  .route("/register")
  .get(userController.renderRegister)
  .post(catchAsync(userController.register));

// RESTful route for logging in a user
router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.login
  );

// RESTful route for logging out a user
router.get("/logout", userController.logout);

// export route
module.exports = router;
