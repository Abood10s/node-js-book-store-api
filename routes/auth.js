const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
} = require("../models/User");
/**
 * @desc Register new User
 * @route /api/auth/register
 * @method POST
 * @access public
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // check if user exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        message: `User ${req.body.email} already exists in the database`,
      });
    }
    //encrypts and hashes password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    const result = await user.save();
    const token = user.generateToken();
    // this prevents sending user password in the response why you should send it stupid??
    const { password, ...other } = result._doc;
    //
    res.status(201).json({ ...other, token });
  })
);

/**
 * @desc Login User
 * @route /api/auth/login
 * @method POST
 * @access public
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // check if user exists ""registered"
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: `Invalid email or password`,
      });
    }
    //decrypts passwords then compare user pass and database pass and return true or false
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // if wrong password
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: `Invalid email or password`,
      });
    }

    const token = user.generateToken();
    // this prevents sending user password in the response why you should send it stupid??
    const { password, ...other } = user._doc;
    //
    res.status(200).json({ ...other, token });
  })
);
module.exports = router;
