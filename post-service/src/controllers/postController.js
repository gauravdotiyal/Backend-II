const Post = require("../models/Post");
const logger = require("../utils/logger");
const { validateCreatePost } = require("../utils/validation");

const createPost = async (req, res) => {
  logger.info("Crete Post Endpoints Hits");
  try {
    //validate the schema-- utils
    const { error } = validateCreatePost(req.body);
    if (error) {
      logger.warn("Validation Error in reg. ", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { content, mediaIds } = req.body;

    const newlyCreatedPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });

    console.log("trying");
    await newlyCreatedPost.save();

    logger.info("Post created successfully");
    res.status(201).json({
      success: true,
      message: "Post Created Successfully ",
    });
  } catch (error) {
    logger.error("Error while creating post", error);
    res.status(400).json({
      success: false,
      message: "Error while creating the post",
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    // for applying pagination
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const startIndex = (page - 1) * limit;

    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey);

    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(startIndex);

    const totalNoOfPosts = await Post.countDocuments();

    const result = {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalNoOfPosts / limit),
      totalPost: totalNoOfPosts,
    };

    // save your posts in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    logger.error("Error while fetching all posts", error);
    res.status(400).json({
      success: false,
      message: "Error while fetching all the posts",
    });
  }
};

const getOnePost = async (req, res) => {
  try {
  } catch (error) {
    logger.error("Error while creating post", error);
    res.status(400).json({
      success: false,
      message: "Error while creating the post",
    });
  }
};

const deletePost = async (req, res) => {
  try {
  } catch (error) {
    logger.error("Error while creating post", error);
    res.status(400).json({
      success: false,
      message: "Error while creating the post",
    });
  }
};

module.exports = { createPost, getAllPosts };
