require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const Redis = require("ioredis");
const mongoose = require('mongoose');
const {connectRabbitMQ, consumeEvent}= require('./utils/rabbitmq');
const searchRoutes= require('./routes/search-routes');
const { handleCreateEvent, handleDeleteEvent } = require("./eventHandlers/search-event-handler");


const app= express();

const PORT= process.env.PORT || 3004;

// mongo connection
mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => logger.info("Mongo DB connected Successfully"))
  .catch((err) => logger.error(`Error while connecting to mongodb`, err));

const redisClient = new Redis(process.env.REDIS_URL);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use((req, res, next) => {
  logger.info(`Received ${req.method} requested to ${req.url}`);
  logger.info(`Received body ${req.body}`);
  next();
});



// Homework Implement ip based rate limiting routing here for sensitive endpoints


app.use('/api/search',searchRoutes);

app.use(errorHandler);


async function startServer(){
  try {
    await connectRabbitMQ();
    await consumeEvent('post.created', handleCreateEvent);
    await consumeEvent('post.deleted', handleDeleteEvent);

  } catch (error) {
    logger.info(error, `Failed to Start the Search Service`);
  }
}


startServer();


