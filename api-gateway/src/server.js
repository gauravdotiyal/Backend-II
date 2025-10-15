require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Redis = require("ioredis");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const proxy = require("express-http-proxy");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;
const redisClient = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());

// ip based rate limiting for the sensitive endpoints => Default rahega yeh
const rateLimitOptions = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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

app.use(rateLimitOptions);

// logger middleware for console
app.use((req, res, next) => {
  logger.info(`Request Received by ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

// achieving proxy service
// localhost:3000/v1/auth/register||login ==> targets==> localhost:3001/api/auth/register||login

const proxyOptions = {
  proxyReqPathResolver: (req) => {
    console.log("hell")
    return req.originalUrl.replace(/^\/v1/, "/api");
  }, 
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Proxy Error ${err.message}`);  
    res.status(500).json({
      message: "Internal Server Error Coming", 
      error: err.message,
    });
  },
};

// setting up proxy for our identity service
app.use(
  "/v1/auth",
  proxy(process.env.IDENTITY_SERVICE_URL, {
    ...proxyOptions, 
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json"; 
      return proxyReqOpts;
    }, 
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from Identity service : ${proxyRes.statusCode}`
      ); 
      return proxyResData;
    },
  })
);

app.use(errorHandler);

app.listen(PORT, ()=>{
    logger.info(`API gateway is running on PORT ${PORT}`);
    logger.info(`Identity Service is running on URL ${process.env.IDENTITY_SERVICE_URL}`);
    logger.info(`Redis URL ${process.env.REDIS_URL}`);

})
