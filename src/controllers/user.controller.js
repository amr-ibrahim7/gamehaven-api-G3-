import {
  getUserOrderHistory,
  getUserProfile,
  loginUser,
  registerUser,
  updateUserByAdmin,
} from "../services/user.service.js";

const registerUserController = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getUserProfileController = async (req, res) => {
  try {
    const result = await getUserProfile(req.user._id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getUserOrderHistoryController = async (req, res) => {
  try {
    const orders = await getUserOrderHistory(req.user._id);
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAdminUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    const updatedUser = await updateUserByAdmin(userId, updatedData);

    if (updatedUser) {
      res.json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getUserOrderHistoryController,
  getUserProfileController,
  loginUserController,
  registerUserController,
  updateAdminUserController,
};
