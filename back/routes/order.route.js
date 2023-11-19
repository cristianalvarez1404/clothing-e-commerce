import express from "express";
import { validateUserLogin } from "../middlewares/validateUserLogin.js";
import { validateUserRole } from "../middlewares/validateUserRole.js";
import { OrderController } from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/", validateUserLogin, OrderController.createOrder);
orderRouter.get("/", validateUserLogin, OrderController.getOrders);
orderRouter.get("/admin", validateUserRole, OrderController.getOrdersForAdmin);
orderRouter.put(
  "/:idOrder",
  validateUserLogin,
  OrderController.updateOrderUser
);
orderRouter.put(
  "/modifyStatus/:id",
  validateUserLogin,
  OrderController.updateStatusOrder
);
orderRouter.delete("/:id", validateUserLogin, OrderController.deleteOrder);

export { orderRouter };
