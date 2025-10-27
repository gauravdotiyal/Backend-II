const Search = require("../models/Search")
const logger = require("../utils/logger")


async function handleCreateEvent(event){
    try {
        const newSearchPost= new Search({
            postId:event.postId,
            userId:event.userId,
            content:event.content,
            createdAt:event.createdAt,
        })

        await newSearchPost.save();

        logger.info(`Search Post Created ${event.postId} , ${newSearchPost._id.toString()}`)
    } catch (error) {
        logger.error(error, 'Error handling post creation event')
    }
}

module.exports={handleCreateEvent};
