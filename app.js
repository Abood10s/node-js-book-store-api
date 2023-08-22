const express = require("express");
const dotenv = require("dotenv").config();

const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errors");
const connectToDb = require("./config/db");
//=========================
//init app
const app = express();
// connect to database
connectToDb();
//=========================

//عشان الداتا اللي جاية من الفرونت بالفورم يفهمها الexpress لانها مبعوتة json
//بدونها بتقدرش تخزن حاجة جاية منPOST
//=========================
// this app contains the 4 methods "verbs" get,post,put,delete
//app.get("route",routehandler(req,res))
// if request o ftype get comes to route "/" the response will be hello welcome...

// middleware something has err,req,res,next and callback function written in app.use
// Law: if you don't give response you should use next() if you send res no need for next or following middle wares and routes won't work
// الترتيب  مهم بال middlewares
app.use(express.json());
app.use(logger);
// lets express know what view engine you use to render html to client ejs or pug
app.set("view engine", "ejs");

// ROUTES
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/password", require("./routes/password"));

//we should write errorhandler middleware after routes الترتيب مهم
// middle ware have err also
//  مش حيوصل هنا الاا اذا كان في خطا لانه كل راوت فوق فيه استجابة
app.use(notFound);
app.use(errorHandler);
// Running the server
//.listen(port,callback)
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `server is running in ${process.env.NODE_ENV} mode or port ${PORT}`
  )
);
