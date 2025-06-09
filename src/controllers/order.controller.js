import asyncHandler from "express-async-handler";
import {
    getOrderByIdService,
    getUserOrdersService,
    placeOrderService
} from "../services/order.service.js";


export const placeOrder = asyncHandler(async (req, res) => {
    const order = await placeOrderService(req.user._id);

    res.status(201).json({
        message: "Order placed successfully",
        order
    });
});

export const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await getUserOrdersService(req.user._id);

    res.status(200).json({
        message: "Orders retrieved successfully",
        orders
    });
});


export const getOrderById = asyncHandler(async (req, res) => {
    const order = await getOrderByIdService(req.user._id, req.params.id);

    res.status(200).json({
        message: "Order retrieved successfully",
        order
    });
});