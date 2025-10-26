require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const mediaRoutes = require("./routes/media-routes");
const mongoose = require("mongoose");
const { connectRabbitMQ, consumeEvent } = require("./utils/rabbitmq");
const { handlePostDeleted } = require("./eventHandlers/media-event-handler");

const app = express();
const PORT = process.env.PORT || 3003;

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => logger.info("Mongo DB connected Successfully"))
  .catch((err) => logger.error(`Error while connecting to mongodb`, err));

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body ${req.body}`);
  next();
});

// implement ip based rate limitting for sensitive endpoints

app.use("/api/media", mediaRoutes);

app.use(errorHandler);

async function startsServer() {
  try {
    await connectRabbitMQ();
    await consumeEvent('post.deleted',handlePostDeleted);
    app.listen(PORT, () => {
      logger.info(`Media Service app is running on port ${PORT} successfully`);
    });
  } catch (error) {
    logger.error("Failed to connect to server ", error); 
    process.exit(1);
  }
}

startsServer(); 

// app.listen(PORT, () => {
//       logger.info(`Media Service app is running on port ${PORT} successfully`);
//     });

// unhandeled promise rejection

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});
