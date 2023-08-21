const mongoose = require("mongoose");
const Joi = require("joi");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 350,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cover: {
      type: String,
      required: true,
      enum: ["Soft cover", "Hard cover"],
      // either soft or hard only
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);
function validateCreateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200).required(),
    description: Joi.string().trim().min(5).max(350).required(),
    author: Joi.string().required(),
    price: Joi.number().min(0).required(),
    cover: Joi.string().valid("Soft cover", "Hard cover").required(),
  });
  return schema.validate(obj);
}
function validateUpdateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200),
    description: Joi.string().trim().min(3).max(500),
    author: Joi.string().trim().min(3).max(200),
    price: Joi.number().min(0),
    cover: Joi.string().valid("Soft cover", "Hard cover"),
  });
  return schema.validate(obj);
}
module.exports = {
  Book,
  validateCreateBook,
  validateUpdateBook,
};
