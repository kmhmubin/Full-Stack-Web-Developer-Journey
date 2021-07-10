// require express
const express = require("express");
const app = express();

// view engine setup
app.set("view engine", "ejs");

// root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
