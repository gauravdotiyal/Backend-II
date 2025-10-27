const Search = require("../models/Search");
const logger = require("../utils/logger");

const searchPostController = async (req, res) => {
  logger.info(`Search Endpont Hit`);

  try {
    const { query } = req.query;
    const results= await Search.find(
        { $text: { $search: query } }, // if we have created .index in the model of Search
        {score:{$meta:'textScore'}} // max score one will be searched

    ).sort({score:{$meta:'textScore'}}).limit(10); 

    res.json({results});

  } catch (error) {
    logger.error("Error while Searching post", error);
    res.status(400).json({
      success: false,
      message: "Error while creating the post",
    });
  }
};

module.exports = { searchPostController };
