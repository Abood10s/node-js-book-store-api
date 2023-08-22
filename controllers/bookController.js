const asyncHandler = require("express-async-handler");
const {
  Book,
  validateCreateBook,
  validateUpdateBook,
} = require("../models/Book");

/**
 * @desc Get all books
 * @route /api/books
 * @method GET
 * @access public
 */
// if i want to send array, json file i use json like "send"

//  documentation for each method in the route

// populate gets the author object is the response attached with each book
// second parameter for populate only gets specific columns
const getAllBooks = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  let books;
  if (minPrice && maxPrice) {
    books = await Book.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).populate("author", ["id", "firstName", "lastName"]);
  } else {
    books = await Book.find()
      .sort({ price: 1 })
      .populate("author", ["id", "firstName", "lastName"]);
  }
  res.status(200).json(books);
});
/**
 * @desc Get book by id
 * @route /api/books/:id
 * @method GET
 * @access public
 */
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

/**
 * @desc create new book
 * @route /api/books
 * @method POST
 * @access  private (only Admins)
 */

const createBook = asyncHandler(async (req, res) => {
  //req.body gets data sent from the front end in the form ...
  //status 201 => create Successfully
  //status 400 => bad request

  // validate the coming data from the frontend form
  const { error } = validateCreateBook(req.body);
  if (error) {
    // return عشان ما يكمل يطلع
    return res.status(400).json({ message: error.details[0].message });
  }
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    price: req.body.price,
    cover: req.body.cover,
  });
  const result = await book.save();
  res.status(201).json(result);
});

/**
 * @desc Update a book
 * @route /api/books/:id
 * @method PUT
 * @access  private (only Admins)
 */
const updateBook = asyncHandler(async (req, res) => {
  const { error } = validateUpdateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover,
      },
    },
    { new: true }
  );
  res.status(200).json(updatedBook);
});

/**
 * @desc Delete a book
 * @route /api/books/:id
 * @method DELETE
 * @access  private (only Admins)
 */

const deleteBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "book has been Deleted successfully" });
  } else {
    res.status(404).json({ message: "book not found" });
  }
});
module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBookById,
};
