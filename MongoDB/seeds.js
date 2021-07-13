// This is only for development use.
// Do not include this file in the production environment.

const mongoose = require("mongoose");

// import product model
const Product = require("./models/product");

// Database connection
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

// Create a product
// const product = new Product({
//   name: "Mango",
//   price: 10.0,
//   category: "Fruit",
// });
// product
//   .save()
//   .then((product) => {
//     console.log(`Product ${product.name} created`);
//   })
//   .catch((err) => {
//     console.log("Error creating product:", err);
//   });

// seed the database with some products alogn with the categories

const seedProducts = [
  {
    name: "Banana",
    price: 5.0,
    category: "Fruit",
  },
  {
    name: "Pineapple",
    price: 7.55,
    category: "Fruit",
  },
  {
    name: "Coconut",
    price: 3.99,
    category: "Fruit",
  },
  {
    name: "Apple",
    price: 4.99,
    category: "Fruit",
  },
  {
    name: "Orange",
    price: 2.5,
    category: "Fruit",
  },
  {
    name: "Strawberry",
    price: 1.0,
    category: "Fruit",
  },
  {
    name: "Grapefruit",
    price: 1.55,
    category: "Fruit",
  },
  {
    name: "Cherry",
    price: 0.55,
    category: "Fruit",
  },
  {
    name: "Fairy Eggplant",
    price: 1.0,
    category: "Vegetable",
  },
  {
    name: "Tomato",
    price: 3.99,
    category: "Vegetable",
  },
  {
    name: "Cucumber",
    price: 1.0,
    category: "Vegetable",
  },
  {
    name: "Carrot",
    price: 1.22,
    category: "Vegetable",
  },
  {
    name: "Potato",
    price: 2.0,
    category: "Vegetable",
  },
  {
    name: "Beetroot",
    price: 3.45,
    category: "Vegetable",
  },
  {
    name: "Onion",
    price: 0.59,
    category: "Vegetable",
  },
  {
    name: "Cauliflower",
    price: 2.3,
    category: "Vegetable",
  },
  {
    name: "Spinach",
    price: 2.5,
    category: "Vegetable",
  },
  {
    name: "Chocolate Whole Milk",
    price: 10.89,
    category: "Dairy",
  },
  {
    name: "Whole Milk",
    price: 5.9,
    category: "Dairy",
  },
  {
    name: "Milk",
    price: 3.1,
    category: "Dairy",
  },
  {
    name: "Cream",
    price: 5.66,
    category: "Dairy",
  },
  {
    name: "Butter",
    price: 1.44,
    category: "Dairy",
  },
  {
    name: "Cream",
    price: 2.69,
    category: "Dairy",
  },
  {
    name: "Egg",
    price: 3.11,
    category: "Dairy",
  },
  {
    name: "Cheese",
    price: 2.6,
    category: "Dairy",
  },
];

// insert the products in database using mongoose
Product.insertMany(seedProducts)
  .then((products) => {
    console.log("Products inserted");
  })
  .catch((err) => {
    console.log("Error inserting products:", err);
  });
