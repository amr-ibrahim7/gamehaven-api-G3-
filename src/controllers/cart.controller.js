import asyncHandler from "express-async-handler";
import { clearCartService, createCartService, getCartService, updateCartService } from "../services/cart.service.js";
import Cart from "../models/cartModel.js";

//==========================================CREATE / ADD TO CART=====================================================
export const createCart = asyncHandler(async (req, res) => {
    const { gameId, quantity } = req.body;
    const cart = await createCartService(req.user._id, gameId, quantity);
    res.status(201).json({ message: cart.newCart ? "Cart created successfully!" : "Game added successfully", cart: cart.data });
});


//==================================================GET CART=========================================================
export const getCart = asyncHandler(async (req, res) => {
    const cart = await getCartService(req.user._id);
    res.status(200).json({ cart });
});


//==========================================UPDATE CART QUANTITY OR REMOVE=====================================================
export const updateCart = asyncHandler(async (req, res) => {
    const { gameId, removeQty } = req.body;

    const updatedCart = await updateCartService(req.user._id, gameId, removeQty);

    res.status(200).json({
        message: "Cart updated successfully",
        cart: updatedCart,
    });
});

//==========================================CLEAR CART=====================================================

export const clearCart = asyncHandler(async (req, res) => {
    const cart = await clearCartService(req.user._id);

    res.status(200).json({ message: "Cart is now empty", cart });
});