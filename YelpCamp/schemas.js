const Joi = require("joi");
const { model } = require("mongoose");

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

// backend form validation using joi

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    review: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
