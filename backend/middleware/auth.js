const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("auth-token");

    if (!token) {
      return res.status(401).json({
        message: "Please authenticate using a valid token",
      });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user = data;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = auth;
