import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./DB/dbConnection.js";
import errorHandler from "./middleware/errorHandler.js";
import cartRoutes from "./routes/cart.routes.js";
import gameRoutes from "./routes/game.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("backend is working!");
});

app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
