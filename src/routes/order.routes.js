import express from "express";
import {
  getOrderById,
  getUserOrders,
  placeOrder,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";
import { getOrderByIdValidation } from "../validation/order.validation.js";

const router = express.Router();

router.post("/", protect, placeOrder);

router.get("/", protect, getUserOrders);

router.get("/:id", protect, getOrderByIdValidation, validate, getOrderById);

export default router;
