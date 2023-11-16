import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrders,
  getOrdersForAdmin,
  updateOrderUser,
  updateStatusOrder,
} from "../controllers/order.controller.js";
import { validateUserLogin } from "../middlewares/validateUserLogin.js";
import { validateUserRole } from "../middlewares/validateUserRole.js";

const orderRouter = express.Router();

orderRouter.post("/", validateUserLogin, createOrder);
orderRouter.get("/", validateUserLogin, getOrders);
orderRouter.get("/admin", validateUserRole, getOrdersForAdmin);
orderRouter.put("/:idOrder", validateUserLogin, updateOrderUser);
orderRouter.put("/modifyStatus/:id", validateUserLogin, updateStatusOrder);
orderRouter.delete("/:id", validateUserLogin, deleteOrder);

export { orderRouter };
