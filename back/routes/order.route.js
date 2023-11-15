import express from "express";
import {
  createOrder,
  getOrders,
  getOrdersForAdmin,
  updateStatusOrder,
} from "../controllers/order.controller.js";
import { validateUserLogin } from "../middlewares/validateUserLogin.js";
import { validateUserRole } from "../middlewares/validateUserRole.js";

const orderRouter = express.Router();

orderRouter.post("/", validateUserLogin, createOrder);
orderRouter.get("/admin/:id", validateUserRole, getOrdersForAdmin);
orderRouter.get("/:id", validateUserLogin, getOrders);
orderRouter.put("/modifyStatus/:id", validateUserLogin, updateStatusOrder);

export { orderRouter };
