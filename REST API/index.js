const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuid } = require("uuid");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// dummy comments
let comments = [
  { id: uuid(), username: "Todd", comment: "LOL that is so funny!" },
  {
    id: uuid(),
    username: "Skyler",
    comment: "I like to go birdwathching with my cat",
  },
  {
    id: uuid(),
    username: "Sk8erBoi",
    comment: "Plz delete your account, Todd",
  },
  { id: uuid(), username: "onlysaysMeoww", comment: "meoww meoww meoww" },
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
  comments.push({ username, comment, id: uuid() });
  res.redirect("/comments");
});

// get the comment id from the url
app.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  res.render("comments/show", { comment });
});

// edit the comment
app.get("/comments/:id/edit", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  res.render("comments/edit", { comment });
});

// update the comment
app.patch("/comments/:id", (req, res) => {
  const { id } = req.params;
  const updateComment = req.body.comment;
  const foundComment = comments.find((c) => c.id === id);
  foundComment.comment = updateComment;
  res.redirect("/comments");
});

// delete the comment
app.delete("/comments/:id", (req, res) => {
  const { id } = req.params;
  comments = comments.filter((c) => c.id !== id);
  res.redirect("/comments");
});

app.listen(3000, () => {
  console.log("Server running on PORT 3000");
});
