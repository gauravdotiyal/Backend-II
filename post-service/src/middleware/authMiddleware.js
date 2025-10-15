const logger = require("../utils/logger");

const authenticateRequest = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    logger.warn("Access Attempted without User ID");
    res.status(400).json({
      success: false,
      message: "Access Attempted without User Id",
    });
  }
  req.user = { userId };
  next();
};

module.exports = { authenticateRequest };
