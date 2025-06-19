import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
reviewSchema.index({ user: 1, game: 1 }, { unique: true });

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
    category: {
      type: String,
      required: true,
      enum: [
        "Action",
        "Adventure",
        "RPG",
        "Strategy",
        "Sports",
        "Racing",
        "Simulation",
        "Puzzle",
        "Horror",
        "Shooter",
      ],
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
    imageUrl: {
      type: String,
      required: false,
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
