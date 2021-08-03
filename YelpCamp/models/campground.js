const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require("passport");
const Review = require("./review");

// image schema
const imageSchema = new Schema({
  url: String,
  filename: String,
});

// image schema for thumbnail
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

// Schema Definition
const CampgroundSchema = new Schema({
  title: String,
  images: [imageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Delete the reviews if the campground is deleted
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

// Export the Mongoose model
module.exports = mongoose.model("Campground", CampgroundSchema);
