import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { getUserOrdersService } from "./order.service.js";

const registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error("Email already registered");

  const user = await User.create(data);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);
  if (!token) {
    throw new Error("Token generation failed");
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return { user };
};

const getUserOrderHistory = async (userId) => {
  return await getUserOrdersService(userId);
};

const updateUserByAdmin = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (data.name) {
    user.name = data.name;
  }
  if (data.email && data.email !== user.email) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error("Email already in use by another user");
    user.email = data.email;
  }
  if (
    data.role &&
    ["user", "admin"].includes(data.role) &&
    data.role !== user.role
  ) {
    user.role = data.role;
  }

  const updatedUser = await user.save();
  return updatedUser.toObject();
};

export {
  getUserOrderHistory,
  getUserProfile,
  loginUser,
  registerUser,
  updateUserByAdmin,
};
