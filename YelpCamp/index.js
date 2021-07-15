const express = require("express");
const app = express();
const path = require("path");

// set up the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// set up the root route
app.get("/", (req, res) => {
  res.render("index");
});

// Set up the server
app.listen(3000, () => {
  console.log("Server is running");
});
