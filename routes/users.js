const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifytoken");
/**
 * @desc Update User
 * @route /api/users/:id
 * @method PUT
 * @access private
 */

router.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    //token and id is in the header as you put
    console.log(req.headers);
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
        },
      },
      { new: true }
    ).select("-password");
    //  removes password from the response
    res.status(200).json(updatedUser);
  })
);

/**
 * @desc Get all users
 * @route /api/users/
 * @method GET
 * @access private (Only Admin)
 */

router.get(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  })
);

/**
 * @desc Get User by id
 * @route /api/users/:id
 * @method GET
 * @access private (Only Admin & user himself)
 */

router.get(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  })
);

/**
 * @desc  Delete User by id
 * @route /api/users/:id
 * @method DELETE
 * @access private (Only Admin & user himself)
 */

router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User has been deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  })
);
module.exports = router;
