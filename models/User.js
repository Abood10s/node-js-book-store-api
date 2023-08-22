const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 120,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
//sign generates new encrypted token (payload of token, secret string,expiring time in days/hours/minutes)
//you can decode the token from jwt website
// if left empty the 3rd param it will be forever
//generate user token
//you cant write arrow "doesn't recognize this keyword in arrow func" function here because schema is considered class
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "5d" }
  );
};

const User = mongoose.model("User", UserSchema);

//validate register user
function validateRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(120).required(),
    username: Joi.string().trim().min(2).max(120).required(),
    password: passwordComplexity().required(),
  });
  return schema.validate(obj);
}
//validate login user
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(120).required(),
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}
//validate Change password
function validateChangePassword(obj) {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}
//validate Update user
function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(120),
    username: Joi.string().trim().min(2).max(120),
    password: Joi.string().trim().min(6),
  });
  return schema.validate(obj);
}
module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateChangePassword,
};
