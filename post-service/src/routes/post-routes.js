const express= require('express');
const { createPost } = require('../controllers/postController');
const { authenticateRequest } = require('../middleware/authMiddleware');

const router= express.Router();

app.use(authenticateRequest);

// As it is secure ==> So use middleware for it
router.post('/create-post', createPost);

module.exports= router;