const mongoose = require("mongoose");
const Joi = require("joi");
//joi validates before sending a query to the database
//  how author is stored in db and its validation with time stamps
const AuthorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    image: {
      type: String,
      default: "default-avatar.png",
    },
  },
  { timestamps: true }
);
// Author will be a table "collection" in the database
const Author = mongoose.model("Author", AuthorSchema);
//validate create Author
function validateCreateAuthor(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(30).required(),
    lastName: Joi.string().trim().min(3).max(30).required(),
    nationality: Joi.string().trim().min(2).max(100).required(),
    image: Joi.string().trim().min(3).max(200),
  });
  return schema.validate(obj);
}
//validate Update Author

function validateUpdateAuthor(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(30),
    lastName: Joi.string().trim().min(3).max(30),
    nationality: Joi.string().trim().min(2).max(100),
    image: Joi.string().trim().min(3).max(200),
  });
  return schema.validate(obj);
}
module.exports = {
  Author,
  validateCreateAuthor,
  validateUpdateAuthor,
};
