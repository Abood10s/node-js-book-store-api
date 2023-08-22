const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifytoken");
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBookById,
} = require("../controllers/bookController");
//method chaining
//for "/" this route these get post has same route
// /api/books
router.route("/").get(getAllBooks).post(verifyTokenAndAdmin, createBook);

//same /:id endpoint but different methods
// /api/books/:id
router
  .route("/:id")
  .get(getBookById)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBookById);

module.exports = router;
