const mongoose = require("mongoose");

async function connectToDb() {
  //promise : connection to database bookStoreDB "name of db data inside it"
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to Mongodb...");
  } catch (error) {
    console.log("connection failed" + error);
  }
}
module.exports = connectToDb;
//same as above but older
//   mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => console.log("connected to Mongodb..."))
//     .catch((error) => console.log("connection failed" + error));
