import Cart from "../models/cartModel.js";
import Game from "../models/gameModel.js";
import Order from "../models/orderModel.js";
import { clearCartService } from "./cart.service.js";


export const placeOrderService = async (userId) => {

    const cart = await Cart.findOne({ user: userId }).populate('games.gameId');
    
    if (!cart || cart.games.length === 0) {
        const error = new Error("Cart is empty");
        error.statusCode = 400;
        throw error;
    }


    for (const item of cart.games) {
        const game = await Game.findById(item.gameId._id);
        if (game.stock < item.quantity) {
            const error = new Error(`Not enough stock for ${game.title}`);
            error.statusCode = 400;
            throw error;
        }
    }

    
    const orderItems = cart.games.map(item => ({
        game: item.gameId._id,
        quantity: item.quantity,
        price: item.gameId.price, 
    }));


    const order = await Order.create({
        user: userId,
        items: orderItems,
        totalPrice: cart.totalPrice,
    });

    
    for (const item of cart.games) {
        await Game.findByIdAndUpdate(
            item.gameId._id,
            { $inc: { stock: -item.quantity } }
        );
    }


    await clearCartService(userId);

    // Return populated order
    const populatedOrder = await Order.findById(order._id)
        .populate('user', 'name email')
        .populate('items.game', 'title platform genre');

    return populatedOrder;
};


export const getUserOrdersService = async (userId) => {
    const orders = await Order.find({ user: userId })
        .populate('items.game', 'title platform genre imageUrl')
        .sort({ orderedAt: -1 });

    return orders;
};


export const getOrderByIdService = async (userId, orderId) => {
    const order = await Order.findOne({ _id: orderId, user: userId })
        .populate('user', 'name email')
        .populate('items.game', 'title platform genre imageUrl');

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    return order;
};