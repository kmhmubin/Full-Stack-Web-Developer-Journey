// require express
const express = require("express");
const app = express();
const path = require("path");
const redditData = require("./data.json");

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// public folder
app.use(express.static(path.join(__dirname, "/public")));

// root route
app.get("/", (req, res) => {
  res.render("home", { name: "Home" });
});

app.get("/r/:subreddit", (req, res) => {
  const { subreddit } = req.params;
  const data = redditData[subreddit];
  if (data) {
    res.render("subreddit", {
      ...data,
    });
  } else {
    res.render("notfound", { subreddit });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
