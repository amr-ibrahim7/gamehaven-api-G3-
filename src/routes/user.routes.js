import express from "express";
import {
  getUserProfileController,
  loginUserController,
  registerUserController,
} from "../controllers/user.controller.js";
import { authorizeRoles, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);

router.get("/profile", protect, getUserProfileController);
// router.get('/orders', protect, getUserOrderHistoryController);

router.put("/admin/profile", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin can update profile here" });
});

export default router;
