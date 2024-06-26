const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.currentUserId = decode.userId;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized access", isTokenInvalid: True });
  }
};

module.exports = verifyToken;
