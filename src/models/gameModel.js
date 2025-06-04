import mongoose from 'mongoose';

const gameSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        platform: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        CoverImage: {
            type: String,
            required: false,
        },

    },
    {
        timestamps: true,
    }
);

const Game = mongoose.model('Game', gameSchema);

export default Game;