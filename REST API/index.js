const express = require("express");
const app = express();
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// dummy comments
const comments = [
  { id: 1, username: "Todd", comment: "LOL that is so funny!" },
  {
    id: 2,
    username: "Skyler",
    comment: "I like to go birdwathching with my cat",
  },
  { id: 3, username: "Sk8erBoi", comment: "Plz delete your account, Todd" },
  { id: 4, username: "onlysaysMeoww", comment: "meoww meoww meoww" },
];

// base request for comments url
app.get("/comments", (req, res) => {
  res.render("comments/index", { comments });
});

// base request for new comment url
app.get("/comments/new", (req, res) => {
  res.render("comments/new");
});

// base request for new comment post
app.post("/comments", (req, res) => {
  const { username, comment } = req.body;
  comments.push({ username, comment });
  res.redirect("/comments");
});

// get the comment id from the url
app.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === parseInt(id));
  res.render("comments/show", { comment });
});

app.listen(3000, () => {
  console.log("Server running on PORT 3000");
});
