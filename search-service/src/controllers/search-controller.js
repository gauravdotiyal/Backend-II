const Search = require("../models/Search");
const logger = require("../utils/logger");

//implement caching here for 2 to 5 mins  
// everytime when we add a new post invalidate the cache as per new post created 
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
