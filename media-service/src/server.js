require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const mediaRoutes = require("./routes/media-routes");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3003;

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => logger.info("Mongo DB connected Successfully"))
  .catch((err) => logger.error(`Error while connecting to mongodb`, err));


app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req,res,next)=>{
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body ${req.body}`);
    next();
});

// implement ip based rate limitting for sensitive endpoints


app.use('/api/media' , mediaRoutes);

app.use(errorHandler);


app.listen(PORT, ()=>{
    logger.info(`App is running on port ${PORT} successfully`);
})



