import Game from "../models/gameModel.js";

const getGames = async (query) => {
  const pageSize = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * pageSize;

  let filter = {};
  if (query.genre) filter.genre = new RegExp(query.genre, "i");
  if (query.platform) filter.platform = new RegExp(query.platform, "i");
  if (query.search) {
    filter.$or = [
      { title: new RegExp(query.search, "i") },
      { description: new RegExp(query.search, "i") },
    ];
  }

  const count = await Game.countDocuments(filter);
  const games = await Game.find(filter)
    .limit(pageSize)
    .skip(skip)
    .sort({ createdAt: -1 });

  return { games, page, pages: Math.ceil(count / pageSize), total: count };
};

const getGameById = async (id) => {
  const game = await Game.findById(id);
  if (!game) {
    throw new Error("Game not found");
  }
  return game;
};

const createGame = async (gameData) => {
  const game = new Game(gameData);
  const createdGame = await game.save();
  return createdGame;
};

const updateGame = async (id, gameData) => {
  const game = await Game.findById(id);
  if (game) {
    game.title = gameData.title || game.title;
    game.description = gameData.description || game.description;
    game.platform = gameData.platform || game.platform;
    game.genre = gameData.genre || game.genre;
    game.price = gameData.price || game.price;
    game.stock = gameData.stock || game.stock;
    game.imageUrl = gameData.imageUrl || game.imageUrl;

    const updatedGame = await game.save();
    return updatedGame;
  } else {
    throw new Error("Game not found");
  }
};

const deleteGame = async (id) => {
  const game = await Game.findById(id);
  if (game) {
    await game.deleteOne();
    return { message: "Game removed" };
  } else {
    throw new Error("Game not found");
  }
};

export { createGame, deleteGame, getGameById, getGames, updateGame };
