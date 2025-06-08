import Game from "../models/gameModel.js";
import Cart from "../models/cartModel.js";

//==========================================CREATE / ADD TO CART=====================================================
export const createCartService = async (userId, gameId, quantity) => {
    const game = await Game.findOne({ _id: gameId, stock: { $gte: quantity } });
    if (!game) {
        const error = new Error("Game doesn't exist or is out of stock!");
        error.statusCode = 404;
        throw error;
    }

    const price = game.price;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            games: [{ gameId, quantity, price }],
            totalPrice: price * quantity,
        });
        const populatedCart = await Cart.findById(cart._id).populate('games.gameId', 'title price');

        return { newCart: true, data: populatedCart };
    }
    //flag to check if game exists --> if it does update quantity and price if it doesn't then add it to cart
    let found = false;

    for (const item of cart.games) {
        if (item.gameId.toString() === gameId) {
            item.quantity += quantity;
            item.price = price * item.quantity;
            found = true;
        }
    }

    if (!found) {
        cart.games.push({ gameId, quantity, price });
    }

    cart.totalPrice = cart.games.reduce((sum, item) => sum + item.price, 0);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('games.gameId', 'title price');
    return { newCart: false, data: populatedCart };
};


//==================================================GET CART=========================================================
export const getCartService = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate("games.gameId", "title price");

    if (!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        throw error;
    }

    return cart;
};


//==========================================UPDATE CART QUANTITY OR REMOVE=====================================================
export const updateCartService = async (userId, gameId, removeQty) => {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        throw error;
    }

    let gameFound = false;

    // loop through games in the cart
    for (let i = 0; i < cart.games.length; i++) {
        const item = cart.games[i];

        if (item.gameId.toString() === gameId) {
            gameFound = true;

            // If removeQty >= item.quantity ---> remove the game completely
            if (removeQty === undefined || removeQty >= item.quantity) {
                cart.games.splice(i, 1);
            } else {
                // update quantity and price
                const unitPrice = item.price / item.quantity;
                item.quantity -= removeQty;
                item.price = unitPrice * item.quantity;
            }

            break;
        }
    }

    if (!gameFound) {
        const error = new Error("Game not found in cart");
        error.statusCode = 404;
        throw error;
    }

    // recalculate total cart price
    cart.totalPrice = cart.games.reduce((sum, item) => sum + item.price, 0);

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('games.gameId', 'title price');
    return populatedCart;
};



//==========================================CLEAR CART=====================================================
export const clearCartService = async (userId) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { games: [] , totalPrice: 0 },
    { new: true }
  );

  if (!cart) {
    const error = new Error("Cart does not exist");
    error.statusCode = 404;
    throw error;
  }

  return cart;
};
