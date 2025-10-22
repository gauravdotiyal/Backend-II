const express = require("express");
const {
  createPost,
  getAllPosts,
  getOnePost,
  deletePost,
} = require("../controllers/postController");
const { authenticateRequest } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateRequest);

// As it is secure ==> So use middleware for it
router.post("/create-post", createPost);
router.get("/all-posts", getAllPosts);
router.get("/:id", getOnePost);
router.delete("/:id", deletePost);

module.exports = router;
