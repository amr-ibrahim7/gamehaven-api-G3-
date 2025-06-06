const express = require('express');
const router = express.Router();
const {
  registerUserController,
  loginUserController,
  getUserProfileController,
  getUserOrderHistoryController,
  logoutUserController
} = require('../controllers/user.controller');
const { protect, admin } = require('../middlewares/auth.middleware');



router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.post('/logout', logoutUserController);
router.get('/profile', protect, getUserProfileController);
router.get('/orders', protect, getUserOrderHistoryController);
router.put('/admin/profile', protect, admin, (req, res) => {
  res.json({ message: 'Admin can update profile here' });
});


module.exports = router;
