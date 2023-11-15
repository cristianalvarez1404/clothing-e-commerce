import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  loginUser,
  logoutSession,
  updateUser,
} from "../controllers/user.controller.js";
import { validateUserRole } from "../middlewares/validateUserRole.js";
import { validateUserLogin } from "../middlewares/validateUserLogin.js";
import { validateUserUpdate } from "../middlewares/validateUserUpdate.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/users", validateUserRole, getUsers);
router.get("/:id", validateUserRole, getUser);
router.put("/:id", validateUserUpdate, updateUser);
router.get("/delete/:id", validateUserUpdate, deleteUser);
router.post("/logout", validateUserLogin, logoutSession);

export { router as userRouter };
