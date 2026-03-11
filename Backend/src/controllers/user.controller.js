import User from "../models/user.model.js";
import Department from "../models/department.model.js";
import asyncHandler from "../utils/async.handler.js";
import sendResponse from "../utils/response.helper.js";
import ApiError from "../utils/api.error.js";

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, department, subjects } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "Full name, email and password are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "Email already in use");
  }

  if (role === "HOD" || role === "FACULTY") {
    if (!department || !subjects) {
      throw new ApiError(
        400,
        "Department and subjects are required for HOD and FACULTY roles",
      );
    }
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role,
    department: department || null,
    subjects: subjects || [],
  });

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  return sendResponse(res, 201, "User created successfully", userResponse);
});

export { createUser };
