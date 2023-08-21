const notFound = (req, res, next) => {
  const error = new Error(`Not found ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err });
};
module.exports = {
  notFound,
  errorHandler,
};
