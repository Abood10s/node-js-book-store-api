const jwt = require("jsonwebtoken");
// verify token

function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      //verify decode token and gives you the payload "_id,isAdmin"
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      //decoded return object of payload {_id:... , isAdmin:false/true}
      //we create new object in request with object decoded down here
      req.user = decoded;
      //next gives work to next middleware
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
}
// verify token and authorize the user
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" });
    }
  });
}
// verify token and Admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "you are not allowed, only for Admins" });
    }
  });
}
module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
