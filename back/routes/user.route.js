import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { validateUserRole } from "../middlewares/validateUserRole.js";
import { validateUserLogin } from "../middlewares/validateUserLogin.js";
import { validateUserUpdate } from "../middlewares/validateUserUpdate.js";

const router = express.Router();

router.post("/", UserController.createUser);
router.post("/login", UserController.loginUser);
router.get("/users", validateUserRole, UserController.getUsers);
router.get("/:id", validateUserLogin, UserController.getUser);
router.put("/:id", validateUserUpdate, UserController.updateUser);
router.delete("/delete/:id", validateUserUpdate, UserController.deleteUser);
router.post("/logout", validateUserLogin, UserController.logoutSession);

export { router as userRouter };
