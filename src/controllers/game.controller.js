import asyncHandler from "express-async-handler";
import { body } from "express-validator";
import {
  createGame,
  deleteGame,
  getGameById,
  getGames,
  updateGame,
} from "../services/game.service.js";

const getGamesCtrl = asyncHandler(async (req, res) => {
  const gamesData = await getGames(req.query);
  res.json(gamesData);
});

const getGameByIdCtrl = asyncHandler(async (req, res) => {
  const game = await getGameById(req.params.id);
  res.json(game);
});

const createGameCtrl = asyncHandler(async (req, res) => {
  console.log("req.file:", req.file);
  console.log("req.body:", req.body);
  const { title, description, platform, genre, price, stock } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const gameData = {
    title,
    description,
    platform,
    genre,
    price,
    stock,
    imageUrl,
  };

  const game = await createGame(gameData);
  res.status(201).json(game);
});

const updateGameCtrl = asyncHandler(async (req, res) => {
  const { title, description, platform, genre, price, stock } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const gameData = {
    title,
    description,
    platform,
    genre,
    price,
    stock,
    imageUrl,
  };

  const updatedGame = await updateGame(req.params.id, gameData);
  res.json(updatedGame);
});

const deleteGameCtrl = asyncHandler(async (req, res) => {
  const result = await deleteGame(req.params.id);
  res.json(result);
});

const validateGame = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("platform").notEmpty().withMessage("Platform is required"),
  body("genre").notEmpty().withMessage("Genre is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
];

export {
  createGameCtrl,
  deleteGameCtrl,
  getGameByIdCtrl,
  getGamesCtrl,
  updateGameCtrl,
  validateGame,
};
