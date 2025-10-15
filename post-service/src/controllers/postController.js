const Post = require('../models/Post');
const logger= require('../utils/logger');

const createPost = async(req,res)=>{
    try {
        const {content,mediaIds}= req.body;

        const newlyCreatedPost = new Post({
            userId:req.user.userId,
            content,
            mediaIds : mediaIds || [],
        })
        
        await newlyCreatedPost.save();
        logger.infor('Post created successfully');
        res.status(201).json({
            success:true,
            message:"Post Created Successfully "
        })

    } catch (error) {
        logger.error('Error while creating post',error);
        res.status(400).json({
            success:false,
            message:"Error while creating the post"
        })
    }
}

const getAllPosts= async(req,res)=>{
    try {
        
    } catch (error) {
        logger.error('Error while fetching all posts',error);
        res.status(400).json({
            success:false,
            message:"Error while fetching all the posts"
        })
    }
}

const getOnePost = async(req,res)=>{
    try {
        
    } catch (error) {
        logger.error('Error while creating post',error);
        res.status(400).json({
            success:false,
            message:"Error while creating the post"
        })
    }
}

const deletePost = async(req,res)=>{
    try {
        
    } catch (error) {
        logger.error('Error while creating post',error);
        res.status(400).json({
            success:false,
            message:"Error while creating the post"
        })
    }
}