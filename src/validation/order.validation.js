import { param } from "express-validator";

export const getOrderByIdValidation = [
  param("id").isMongoId().withMessage("Invalid order ID format"),
];
