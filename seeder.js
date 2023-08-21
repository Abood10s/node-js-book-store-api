const { Book } = require("./models/Book");
const { books } = require("./data");
const connectToDb = require("./config/db");
require("dotenv").config();
//this file is dependent from our project so we import all things and connection
//connection to db
// to run the file you write in terminal node seeder
//argv is the terminal commands array
//node seeder -import in the terminal => [0]node [1]seeder [2]-import will insert all books to db you can see in the if else below in the file
//node seeder -import in the terminal => [0]node [1]seeder [2]-remove will delete all books from db you can see in the if else below in the file
connectToDb();
//import Books
const importBooks = async () => {
  try {
    //insertMany only takes array
    await Book.insertMany(books);
    console.log("books imported");
  } catch (error) {
    console.log(error);
    // cuts connection to the database process.exit(1)
    process.exit(1);
  }
};

//Delete All Books from Book table
const DeleteBooks = async () => {
  try {
    //insertMany only takes array
    await Book.deleteMany();
    console.log("All Books Deleted");
  } catch (error) {
    console.log(error);
    // cuts connection to the database process.exit(1)
    process.exit(1);
  }
};

if (process.argv[2] === "-import") {
  importBooks();
} else if (process.argv[2] === "-remove") {
  DeleteBooks();
}
