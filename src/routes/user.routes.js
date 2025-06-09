import express from "express";
import {
  getUserOrderHistoryController,
  getUserProfileController,
  loginUserController,
  registerUserController,
  updateAdminUserController,
} from "../controllers/user.controller.js";
import { authorizeRoles, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);

router.get("/profile", protect, getUserProfileController);
router.get("/orders", protect, getUserOrderHistoryController);

router.put(
  "/admin/profile/:id",
  protect,
  authorizeRoles("admin"),
  updateAdminUserController
);

export default router;
