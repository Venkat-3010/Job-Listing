const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { _id } = jwt.verify(token, process.env.SECRET_KEY);
    req.currentUserId = _id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized access", isTokenInvalid: True });
  }
};

module.exports = verifyToken;
