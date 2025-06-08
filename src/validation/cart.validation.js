import { body } from "express-validator";

export const createCartValidation = [
    body("gameId")
        .notEmpty().withMessage("Game ID is required")
        .isMongoId().withMessage("Invalid Game ID format"),

    body("quantity")
        .notEmpty().withMessage("Quantity is required")
        .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

export const updateCartValidation = [

    body('gameId')
        .notEmpty()
        .withMessage('Game ID is required')
        .isMongoId()
        .withMessage('Invalid Game ID format'),

    body('removeQty')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Remove quantity must be a positive integer'),
];
