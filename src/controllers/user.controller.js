import {
  getUserProfile,
  loginUser,
  registerUser,
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

export {
  getUserProfileController,
  loginUserController,
  registerUserController,
};
