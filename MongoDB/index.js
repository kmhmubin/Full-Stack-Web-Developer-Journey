const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// import product model
const Product = require("./models/product");

// Database connection using mongoose
mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Set up routes
app.get("/", async (req, res) => {
  const products = await Product.find({});
  console.log("Products:", products);
  res.send("Show All Products");
});

// set up RESTful routes for product
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products });
});
// set up RESTful route for new product
app.get("/products/new", (req, res) => {
  res.render("products/new");
});

// set up RESTful route to get new product details
app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect("/products");
});

// set up RESTful routes for product by id
app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/show", { product });
});

// set up RESTful route to edit product details
app.get("/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/edit", { product });
});

// set up RESTful route to update product details
app.put("/products/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  });
  res.redirect("/products/" + product._id);
});

// app listen port 3000
app.listen(3000, () => {
  console.log("app listen port 3000");
});