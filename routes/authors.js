const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { verifyTokenAndAdmin } = require("../middlewares/verifytoken");
//async handler does the try and catch for us
const {
  Author,
  validateCreateAuthor,
  validateUpdateAuthor,
} = require("../models/Author");

/**
 * @desc Get all Authors
 * @route /api/authors
 * @method GET
 * @access public
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // find({}) => gets All in the database // sort 1=>true ,-1 reverse
    // select => gets only 2 columns firstName and lastName
    // in select - "minus" and column with no space after it removes the column from the response
    const authorList = await Author.find({});
    // .sort({ firstName: 1 })
    // .select("firstName lastName -_id");
    res.status(200).json(authorList);
  })
);
/**
 * @desc Get Author by id
 * @route /api/authors/:id
 * @method GET
 * @access public
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    // gets document based on the id
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ message: "Author not found" });
    }
  })
);
/**
 * @desc create new author
 * @route /api/authors
 * @method POST
 * @access private (only Admins)
 */
//now this route is protected before we used verifyTokenAndAdmin before entering data to route
router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    //req.body gets data sent from the front end in the form ...
    //status 201 => create Successfully
    //status 400 => bad request

    // validate the coming data from the frontend form
    const { error } = validateCreateAuthor(req.body);
    if (error) {
      // return عشان ما يكمل يطلع من كل الpost
      return res.status(400).json({ message: error.details[0].message });
    }
    const authorr = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      image: req.body.image,
    });
    const result = await authorr.save();
    res.status(201).json(result);
  })
);

/**
 * @desc Update an author
 * @route /api/authors/:id
 * @method PUT
 * @access private (only Admins)
 */

router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // 3 parameter for findByIdAndUpdate returns the new updated record in the response other than that even if updated the old record will be returned but updated in the database.
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nationality: req.body.nationality,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedAuthor);
  })
);
/**
 * @desc Delete a author
 * @route /api/authors/:id
 * @method DELETE
 * @access private (only Admins)
 */

router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "author has been Deleted successfully" });
    }
  })
);

module.exports = router;
