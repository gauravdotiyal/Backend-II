const Media = require("../models/Media");
const { uploadMediaToCloudinary } = require("../utils/cloudinary");
const logger = require("../utils/logger");

const uploadMedia = async (req, res) => {
  logger.info("Upload Media Starts");

  try {
    if (!req.file) {
      logger.error("File is not present ");
      res.status(400).json({
        message: "File is not present ",
        success: false,
      });
    }

    const { originalname, mimetype, Buffer } = req.file;
    const userId = req.user.userId;

    logger.info(`File details: name= ${originalname}, type:${mimetype}`);
    logger.info(`Uploading to Cloudinary Starts...`);

    const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file);
    logger.info(
      `Cloudinary Upload Successfully. Public Id: ${cloudinaryUploadResult.public_id}`
    );

    const newlyCreatedMedia = new Media({
      publicId: cloudinaryUploadResult.public_id,
      url: cloudinaryUploadResult.secure_url,
      originalName: originalname,
      mimeType: mimetype,
      userId,
    });
    await newlyCreatedMedia.save({
      sucess: true,
      mediaId: newlyCreatedMedia._id,
      url: newlyCreatedMedia.url,
      message: "Media Upload and saved Successfully",
    });

    res.status(200).json({
      sucess: true,
      mediaId: newlyCreatedMedia._id,
      url: newlyCreatedMedia.url,
      message: "Media upload is successfully",
    });
  } catch (error) {
    logger.error("Not able to Upload file", error);
    res.status(400).json({
      message: "Not able to upload file ",
      success: false,
    });
  }
};

const getAllMedia = async (req, res) => {
  try {
      const result  = await Media.find({});
      if(result.length ===0){
           return res.status(404).json({
                success:false,
                message:"Cann't find any media for this user"
            })
        }
      res.json({
        result  
      }) 
  } catch (error) {
    logger.error("Error Fetching Media", error);
    res.status(400).json({
      message: "Error Fetching Media",
      success: false,
    });
  }
};

module.exports = { uploadMedia ,getAllMedia};
