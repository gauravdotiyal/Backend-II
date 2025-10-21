const express = require("express");
const { createPost, getAllPosts } = require("../controllers/postController");
const { authenticateRequest } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateRequest);

// As it is secure ==> So use middleware for it
router.post("/create-post", createPost);
router.get("/all-posts", getAllPosts);

module.exports = router;
