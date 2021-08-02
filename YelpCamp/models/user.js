const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// User schema
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
});

// Add passportLocalMongoose plugin
userSchema.plugin(passportLocalMongoose);

// export the model
module.exports = mongoose.model("User", userSchema);
