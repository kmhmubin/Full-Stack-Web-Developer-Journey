const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema Definition
const CampgroundSchema = new Schema({
  title: string,
  description: string,
  location: string,
});

// Export the Mongoose model
module.exports = mongoose.model("Campground", CampgroundSchema);
