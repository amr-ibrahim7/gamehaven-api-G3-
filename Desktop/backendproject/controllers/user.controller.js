const { registerUser, loginUser, getUserProfile, getUserOrderHistory } = require('../services/user.service');

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
    const { email, password, role } = req.body;
    const result = await loginUser(email, password, role);
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
const logoutUserController = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
};


module.exports = { registerUserController, loginUserController, getUserProfileController, getUserOrderHistoryController ,logoutUserController};
