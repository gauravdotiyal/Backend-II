const RefreshToken = require("../models/RefreshToken.model");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const logger = require("../utils/logger");
const { validateRegistration, validateLogin } = require("../utils/validation");

// user registration
const registerUser = async (req, res) => {
  logger.info("Registration Endpoint Hit...");
  try {
    //validate the schema-- utils
    const { error } = validateRegistration(req.body);
    if (error) {
      logger.warn("Validation Error in reg. ", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { username, email, password } = req.body;

    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      logger.warn("User already exists in db");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = new User({
      username,
      email,
      password,
    });
    await user.save();
    logger.warn("User saved successfully", user._id);

    const { accessToken, refreshToken } = await generateToken(user);

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Registration Error Ocurred", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// user login
const loginUser = async (req, res) => {
  logger.info("Login Endpoint Hits");
  try {
    // validate the user infor
    const { error } = validateLogin(req.body);
    if (error) {
      logger.warn("Validation Erorr in Login", error.details[0].message);
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("Invalid User");
      res.status(400).json({
        success: false,
        message: "Invalid User",
      });
    }

    // check the correct password
    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      logger.warn("User password is not correct");
      res.status(400).json({
        success: true,
        message: "User Password not matched",
      });
    }

    const { accessToken, refreshToken } = await generateToken(user);
    res.status(200).json({
      accessToken,
      refreshToken,
      userId: user._id,
    });
  } catch (error) {
    logger.error("Login Error Ocurred", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// refresh token
const refreshTokenUser = async (req, res) => {
  logger.info("Refresh Token Updation Endpoint Hit");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh Token is not present");
      res.status(400).json({
        success: false,
        message: "Refresh token not present",
      });
    }

    const storedToken = await RefreshToken.findOne({ refreshToken });
    if (!storedToken || storeToken.expiresAt < new Date()) {
      logger.warn("Refresh Token not present in DB");
      res.status(400).json({
        success: false,
        message: "Invalid Refresh Token ",
      });
    }

    // find user present in for that token
    const user = await RefreshToken.findById(storedToken.user);
    if (!user) {
      logger.warn("User Not Found");
      res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const { accessToken: newAcessToken, refreshToken: newRefreshToken } =
      await generateToken(user);

    // delete the existing token and saves the new token
    await RefreshToken.deleteOne({ _id: storedToken._id });

    res.json({
      accessToken: newAcessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {}
};

// logout user
const logoutUser = async (req, res) => {
  logger.info("Logour Endpoint Hits");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh Token not given for Logout");
      res.status(400).json({
        success: false,
        message: "Refresh Token not given for Logout",
      });
    }

    // delete the refreshToken for logout
    await RefreshToken.deleteOne({ token: refreshToken });
    logger.info("Refresh Token deleted Successfully");
    res.status(201).json({
      scucess: true,
      message: "Logging Out Successfully ",
    });
  } catch (error) {}
};

module.exports = { registerUser, loginUser, refreshTokenUser, logoutUser };
