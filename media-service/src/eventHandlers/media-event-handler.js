const Media = require("../models/Media");
const { deleteMediaFromCloudinary } = require("../utils/cloudinary");
const logger = require("../utils/logger");

const handlePostDeleted = async (event) => {
  console.log(event, "eventeventevent");
  const { postId, mediaIds } = event;
  try {
    const mediaToDelete = await Media.find({ _id: { $in: mediaIds } });
    // deleting media from cloudinary as well as Db
    for (const media of mediaToDelete) {
      await deleteMediaFromCloudinary(media.publicId);
      await Media.findByIdAndDelete(media._id);
      logger.info(
        `Deleted Media ${media._id} associated with this deleted post ${postId}`
      );
    }

    logger.info(`Process Deletion of Media of post id ${postId}`);
  } catch (error) {
    logger.error(error, "Error ocurred while media deletion");
  }
};

module.exports = { handlePostDeleted };
