import express from "express";
import { clearCart, createCart, getCart, updateCart } from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";
import { createCartValidation, updateCartValidation } from "../validation/cart.validation.js";

const router = express.Router();

//==========================================CREATE / ADD TO CART=====================================================
router.post("/", protect, createCartValidation, validate, createCart);


//==================================================GET CART=====================================================
router.get("/", protect, getCart);

//==========================================UPDATE CART QUANTITY OR REMOVE=====================================================
router.patch("/update", protect, updateCartValidation, validate, updateCart)

//==========================================CLEAR CART=====================================================
router.put("/clear", protect, clearCart)








export default router;
