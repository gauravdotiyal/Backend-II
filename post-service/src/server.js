require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./utils/logger");
const postRoutes = require("./routes/post-routes");
// const errorHandler=require('./middleware/error')
const { rateLimit } = require("express-rate-limit");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");
const connectDB = require("../../identity-service/config/db");
const errorHandler = require("../../identity-service/src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3002;

// mongo connection
connectDB();

const redisClient = new Redis(process.env.REDIS_URL);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use((req, res, next) =>{
    logger.info(`Received ${req.method} requested to ${req.url}`);
    logger.info(`Received body ${req.body}`);
    next()
});
 
/*
// Rate limiting for per request timing
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 20,
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
  max: 70,
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

app.use('/api/posts/create-post', sensitiveEndpointsLimiter);

*/
// app.use('/api/posts', postRoutes);
// ---->>

// we have to pass our rediclient to our routes
app.use(
  "/api/posts",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  postRoutes
);

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Post service is running on port ${PORT}`);
});

//unhandled promise rejection handler
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandeled rejection at ", promise, "reason ", reason);
});
