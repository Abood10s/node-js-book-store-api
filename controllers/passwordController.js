const asyncHandler = require("express-async-handler");
const { User, validateChangePassword } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

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
/**
 *  @desc    Send Forgot Password link
 *  @route   /password/forgot-password
 *  @method  POST
 *  @access  public
 */

module.exports.sendForgotPasswordLink = asyncHandler(async (req, res) => {
  //check if the user exist in the database to make him change the password
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  //if user exist we will make him a token combine hashed password already with secret existent in env
  const secret = process.env.JWT_SECRET_KEY + user.password;
  // 10 minutes only to reset password else wont be able
  const token = jwt.sign({ email: user.email, id: user._id }, secret, {
    expiresIn: "10m",
  });
  //reset link expires in 10 minute as the token specifies
  const link = `http://localhost:5000/password/reset-password/${user._id}/${token}`;
  //email sending reset link config
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Reset Password",
    html: `<div>  
      <h4>Click on the link below to reset your password</h4>
      <p>${link}</p>
    </div>`,
  };
  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    } else {
      console.log("Email sent", success.response());
      res.render("link-send");
    }
  });
});

/**
 *  @desc    Get Reset Password link
 *  @route   /password/reset-password/:userId/:token
 *  @method  GET
 *  @access  public
 */
module.exports.getResetPasswordView = asyncHandler(async (req, res) => {
  //check if the user exist in the database to make him change the password
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  //if user exist we will make him a token combine hashed password already with secret existent in env
  const secret = process.env.JWT_SECRET_KEY + user.password;

  try {
    jwt.verify(req.params.token, secret);
    //render second parameter to send some info with the view page here in our case it's email
    res.render("reset-password", {
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error" });
  }
});

/**
 *  @desc     Reset The Password
 *  @route   /password/reset-password/:userId/:token
 *  @method  POST
 *  @access  public
 */
module.exports.resetThePassword = asyncHandler(async (req, res) => {
  //validating the new password
  const { error } = validateChangePassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  //if user exist we will make him a token combine hashed password already with secret existent in env
  const secret = process.env.JWT_SECRET_KEY + user.password;

  try {
    jwt.verify(req.params.token, secret);
    // here the user will sent the new password of his account and we want to encrypt it then save it to the database
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.render("success-password");
  } catch (error) {
    console.log(error);
    res.json({ message: "Error" });
  }
});
