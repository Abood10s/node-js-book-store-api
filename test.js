//external file does not relate to our project
//path is core module in node
const path = require("path");
// join combines for 2 paths
// path.join(__dirname,folder name");
const imagesPath = path.join(__dirname, "images");
console.log(__dirname); // will log => D:\nodejs\book-store-api
console.log(imagesPath); //will log => D:\nodejs\book-store-api\images
