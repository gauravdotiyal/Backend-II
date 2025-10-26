const express = require("express");
const { uploadMedia, getAllMedia } = require("../controllers/media-controller");
const { authenticateRequest } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024,
  },
}).single("file");

// In this route there are two middlewares
router.post(
  "/upload",
  authenticateRequest,
  (req, res, next) => {
    upload(req, res, function (err) { 
      if (err instanceof multer.MulterError) {
        logger.error("Multer Error while uploading", err);
        res.status(400).json({
          message: "Multer Error while uploading",
          error: err.message,
          stack: err.stack,
        });
      } else if (err) {
        logger.error("Unknown error occured while uploading:", err);
        return res.status(500).json({
          message: "Unknown error occured while uploading:",
          error: err.message,
          stack: err.stack,
        });
      }

      if (!req.file) {
        res.status(500).json({
          message: "No file found while uploading",
        });
      }

      next();
    });
  },
  uploadMedia
);


router.get('/get', authenticateRequest, getAllMedia);


module.exports = router;
