const User = require("../models/user");

// Controller for register page
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

// Controller for register new user
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (error) => {
      if (error) return next(error);
      req.flash("success", "Welcome to Yelp Camp");
      res.redirect("/campgrounds");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
};

// Controller for render login page
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// Controller for login user
module.exports.login = (req, res) => {
  req.flash("success", "Welcome to Yelp Camp");
  const redirectUrl = req.session.redirectUrl || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// Controller for logout user
module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Successfully logged out");
  res.redirect("/campgrounds");
};
