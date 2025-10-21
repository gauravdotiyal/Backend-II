const mongoose = require("mongoose"); 
const logger = require("../utils/logger");


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    logger.info("Mongo db connected successfully ");
  } catch (error) {
    logger.error("Mongodb Connection Failed", error);
    process.exit(1);
  }
};

module.exports = connectDB; 
