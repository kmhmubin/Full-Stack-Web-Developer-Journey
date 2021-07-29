const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema Definition
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Export the Mongoose model
module.exports = mongoose.model("Campground", CampgroundSchema);
