const asyncHandler = require("express-async-handler");
const { User, validateChangePassword } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");

/**
 *  @desc    Get Forgot Password View
 *  @route   /password/forgot-password
 *  @method  GET
 *  @access  public
 */

module.exports.getForgotPasswordView = asyncHandler((req, res) => {
  // looks for forgot-password file name in views folder "html file"
  // when we want to send html file to client we use render method in response method
  res.render("forgot-password");
});
