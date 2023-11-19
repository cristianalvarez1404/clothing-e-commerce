import express from "express";
import { validateUserRole } from "../middlewares/validateUserRole.js";
import { validateUserLogin } from "../middlewares/validateUserLogin.js";
import { ProductController } from "../controllers/product.controller.js";

const productRoute = express.Router();

productRoute.post("/", validateUserRole, ProductController.createProduct);
productRoute.put("/:id", validateUserRole, ProductController.updateProduct);
productRoute.delete(
  "/delete/:id",
  validateUserRole,
  ProductController.deleteProduct
);
productRoute.get("/", ProductController.getProducts);
productRoute.get("/:id", ProductController.getProduct);
productRoute.post(
  "/review/:id",
  validateUserLogin,
  ProductController.addReviewProduct
);
productRoute.put(
  "/review/:id",
  validateUserLogin,
  ProductController.updateReview
);

export { productRoute };
