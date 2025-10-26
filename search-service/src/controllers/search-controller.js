const logger = require("../utils/logger");

const searchPostController = async (req, res) => {
  logger.info(`Search Endpont Hit`);

  try {
  } catch (error) {
    logger.error("Error while Searching post", error);
    res.status(400).json({
      success: false,
      message: "Error while creating the post",
    });
  }
};
