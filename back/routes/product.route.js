import express from "express";
import {
  addReviewProduct,
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { validateUserRole } from "../middlewares/validateUserRole.js";
import { validateUserLogin } from "../middlewares/validateUserLogin.js";

const productRoute = express.Router();

productRoute.post("/", validateUserRole, createProduct);
productRoute.put("/:id", validateUserRole, updateProduct);
productRoute.delete("/delete/:id", validateUserRole, deleteProduct);
productRoute.get("/", getProducts);
productRoute.get("/:id", getProduct);
productRoute.post("/review/:id", validateUserLogin, addReviewProduct);

export { productRoute };
