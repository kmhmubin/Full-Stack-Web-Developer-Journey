const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema Definition
const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
});

// Export the Mongoose model
module.exports = mongoose.model("Campground", CampgroundSchema);
