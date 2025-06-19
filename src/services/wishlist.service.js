import Game from "../models/gameModel";
import User from "../models/userModel";

export const addToWishlistService = async (userId, gameId) => {
  const game = await Game.findById(gameId);
  if (!game) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.wishlist.includes(gameId)) {
    const error = new Error("Game already in wishlist");
    error.statusCode = 400;
    throw error;
  }

  user.wishlist.push(gameId);
  await user.save();

  return { message: "Game added to wishlist successfully" };
};

export const removeFromWishlistService = async (userId, gameId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.wishlist.pull(gameId);
  await user.save();

  return { message: "Game removed from wishlist successfully" };
};

export const getUserWishlistService = async (userId) => {
  const user = await User.findById(userId)
    .populate(
      "wishlist",
      "title price imageUrl platform genre category averageRating"
    )
    .select("wishlist");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user.wishlist;
};
