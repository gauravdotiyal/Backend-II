const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Access Attempt without valid token");
    return res.status(401).json({
      message: "Authentication Required",
      success: false,
    });
  }

  // verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn("Access Attempt with Invalid token");
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    // providing user to the other service using middleware 
    req.user = user; 
    next();
  });
};

module.exports = { validateToken };
