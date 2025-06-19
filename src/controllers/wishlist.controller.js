import asyncHandler from "express-async-handler";
import {
  addToWishlistService,
  getUserWishlistService,
  removeFromWishlistService,
} from "../services/wishlist.service.js";

export const addToWishlist = asyncHandler(async (req, res) => {
  const { gameId } = req.body;
  const result = await addToWishlistService(req.user._id, gameId);
  res.status(200).json(result);
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { gameId } = req.params;
  const result = await removeFromWishlistService(req.user._id, gameId);
  res.status(200).json(result);
});

export const getUserWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getUserWishlistService(req.user._id);
  res.status(200).json({ wishlist });
});
