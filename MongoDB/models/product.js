const mongoose = require("mongoose");

// product schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    lowercase: true,
    enum: ["fruit", "vegetable", "dairy"],
  },
  createdAt: { type: Date, default: Date.now },
});

// Product model
const Product = mongoose.model("Product", ProductSchema);

// export the model
module.exports = Product;
