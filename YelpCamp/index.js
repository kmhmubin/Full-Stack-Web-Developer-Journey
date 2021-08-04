if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const passportLocal = require("passport-local");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require("connect-mongo");

// import mongoose models
const User = require("./models/user");

// User route
const UserRouter = require("./routes/users");
// campground router
const campgroundRouter = require("./routes/campgrounds");
// review router
const reviewsRouter = require("./routes/reviews");

// MongoDB Altast URL
const dbUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/yelp-camp";

// Connect to database
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// Connect to mongoose db
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to mongoDB");
});

// Create express app
const app = express();

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

// declare session secret
const secret = process.env.SECRET || "yelp-camp";

// set up session and store in mongodb using mongo-connect
app.use(
  session({
    secret,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: dbUrl,
      collection: "sessions",
      touchAfter: 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    },
  })
);

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

// set port to listen on
const port = process.env.PORT || 3000;

// Set up the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
