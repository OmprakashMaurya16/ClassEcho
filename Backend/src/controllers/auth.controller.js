import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "../utils/async.handler.js";
import ApiError from "../utils/api.error.js";
import sendResponse from "../utils/response.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.util.js";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  user.lastLogin = new Date();
  user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return sendResponse(res, 200, "Login successful", {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    },
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, "Refresh token is required");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new ApiError(403, "Invalid refresh token");
  }

  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    throw new ApiError(401, "User not found or inactive");
  }

  const newAccessToken = generateAccessToken(user);

  return sendResponse(res, 200, "Token refreshed successfully", {
    accessToken: newAccessToken,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sendResponse(res, 200, "User fetched", user);
});

export { login, refreshToken, getMe };
