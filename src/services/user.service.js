import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

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

// const getUserOrderHistory = async (userId) => {

//   return [];
// };

export { getUserProfile, loginUser, registerUser };
