import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { validateUserRole } from "../middlewares/validateUserRole.js";

const productRoute = express.Router();

productRoute.post("/", validateUserRole, createProduct);
productRoute.put("/:id", validateUserRole, updateProduct);
productRoute.delete("/delete/:id", validateUserRole, deleteProduct);
productRoute.get("/", getProducts);
productRoute.get("/:id", getProduct);

export { productRoute };
