const express = require("express");
const connectDB = require("../config/db");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const routes = require("./routes/identityService.routes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();


// mongodb connection
connectDB();


const redisClient = new Redis(process.env.REDIS_URL);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  logger.info(`Received ${req.method} requested to ${req.url}`);
  logger.info(`Request body ${req.body} `);
  next();
});
// DDOS Protection and rate limiting
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10, // how many request
  duration: 1,
});
app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate Limiter exceeded for iop ${req.ip}`);
      res.status(429).json({
        success: false,
        message: "too many request",
      });
    });
});
// ip based rate limiting for the sensitive endpoints
const sensitiveEndpointsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint ratelimiter exceeded for Ip ${req.ip}`);
    res.status(429).json({ success: false, message: "too many requests" });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});
 
// apply this sensitive endpoint limiter to our points
app.use("/api/auth/register", sensitiveEndpointsLimiter);



// Routes 
app.use("/api/auth/", routes); 
// error handlere



app.use(errorHandler);



const port = process.env.PORT || 3001;

app.listen(port, () => {
  logger.info(`Identity service is running on port ${port}`);
});



//unhandled promise rejection handler
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandeled rejection at ", promise, "reason ", reason);
});
