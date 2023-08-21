const logger = (req, res, next) => {
  // res.send("this response from logger middleware");
  console.log(
    `Request method ${req.method}, Request protocol ${req.protocol}://${req.get(
      "host"
    )}${req.originalUrl} `
  );
  next();
};
module.exports = logger;
