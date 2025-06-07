import express from "express";

import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  createGameCtrl,
  deleteGameCtrl,
  getGameByIdCtrl,
  getGamesCtrl,
  updateGameCtrl,
  validateGame,
} from "../controllers/game.controller.js";
import { authorizeRoles, protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
});

const router = express.Router();

router.get("/", getGamesCtrl);
router.get("/:id", getGameByIdCtrl);

router
  .route("/admin")
  .post(
    protect,
    authorizeRoles("admin"),
    upload.single("image"),
    validateGame,
    validate,
    createGameCtrl
  );

router
  .route("/admin/:id")
  .put(
    protect,
    authorizeRoles("admin"),
    upload.single("image"),
    validateGame,
    validate,
    updateGameCtrl
  )
  .delete(protect, authorizeRoles("admin"), deleteGameCtrl);

export default router;
