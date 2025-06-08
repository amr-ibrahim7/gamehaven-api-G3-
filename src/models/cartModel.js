import mongoose, { Types } from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },
        games: [
            {
                gameId: {
                    type: Types.ObjectId,
                    ref: "Game",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            }
        ],
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
