if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const ExpressError = require("./utils/ExpressError");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

// import mongoose models
const User = require("./models/user");
const Campground = require("./models/campground");
const Review = require("./models/review");

// User route
const UserRouter = require("./routes/users");
// campground router
const campgroundRouter = require("./routes/campgrounds");
// review router
const reviewsRouter = require("./routes/reviews");

const app = express();
const { lstat } = require("fs");

// Connect to database
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Connect to mongoose db
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to mongoDB");
});

// use ejs-locals for ejs templates
app.engine("ejs", ejsMate);

// set up the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// url encodeed
app.use(express.urlencoded({ extended: true }));
// override POST method
app.use(methodOverride("_method"));

// set up static files
app.use(express.static(path.join(__dirname, "public")));

// mongoose sanitize
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// session config
const sessionConfig = {
  name: "session",
  secret: "yelp-camp",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
  },
};

// set up session
app.use(session(sessionConfig));

// set up flash messages
app.use(flash());

// helmet security
app.use(helmet());

// helmet security for static files
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/douqbebwk/",
        "https://res.cloudinary.com/coderuseless/",
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// passport config
app.use(passport.initialize());
app.use(passport.session());

// passport local strategy
passport.use(new passportLocal.Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middlware for flash messages and current user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// use UserRouter
app.use("/", UserRouter);

// use campground router
app.use("/campgrounds", campgroundRouter);

// use review router
app.use("/campgrounds/:id/reviews", reviewsRouter);

// set up the RESTful root route
app.get("/", (req, res) => {
  res.render("index");
});

// url not found
app.all("*", (req, res, next) => {
  next(new ExpressError("Not Found", 404));
});

// error handler
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(status).render("error", { err });
});

// Set up the server
app.listen(3000, () => {
  console.log("Server is running");
});
