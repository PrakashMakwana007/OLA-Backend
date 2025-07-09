import { User } from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Generate access and refresh tokens
const generateTokens = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new apiError(404, "User not found.");
    }
    const accessToken = user.ganerateAccessToken();
    const refreshToken = user.ganerateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

// User Registration
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password || !role) {
    throw new apiError(400, "All fields are required.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new apiError(400, "User already exists.");
  }

  // Create user
  const user = await User.create({
    fullName,
    email,
    password,
    role,
  });

 
  const { accessToken, refreshToken } = await generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(201).json(
    new apiResponse(201, {
      user: createdUser,
      accessToken,
      refreshToken
    }, "User created successfully.")
  );
});



// User Login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new apiError(400, "Email and password are required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new apiError(400, "user not  found")
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new apiError(400, "Invalid password.");
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    const userData = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true, // Set to false for local development if needed
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse(200, { user: userData, accessToken, refreshToken }, "Login successful"));
});

// User Logout
const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        refreshToken: undefined,
    });

    return res.status(200).json(
        new apiResponse(200, null, "Logout successful")
    );
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingToken) {
        throw new apiError(400, "Refresh token is required");
    }

    try {
        const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || incomingToken !== user.refreshToken) {
            throw new apiError(400, "Invalid or expired token");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new apiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Token refreshed"));
    } catch (error) {
        throw new apiError(500, "Invalid token");
    }
});

// Get Current Logged-in User
const getcurentuser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new apiError(400, "User not found");
    }

    return res.status(200).json(
        new apiResponse(200, req.user, "User retrieved successfully")
    );
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.matchPassword(oldPassword);

    if (!isPasswordCorrect) {
        throw new apiError(400, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new apiResponse(200, {}, "Password changed successfully")
    );
});

export {
    register,
    login,
    logout,
    getcurentuser,
    refreshAccessToken,
    changePassword,
};
