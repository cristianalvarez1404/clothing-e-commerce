import express from "express";
import dotenv from "dotenv/config";
import { dbConnection } from "./config/db.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.route.js";
import { productRoute } from "./routes/product.route.js";
import { orderRouter } from "./routes/order.route.js";
import { questionRouter } from "./routes/question.route.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

app.get("/index", (req, res, next) => {
  res.json({
    success: true,
    data: [],
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/question", questionRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    data: [],
  });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  dbConnection();
  console.log(`Server running on port ${PORT}`);
});
