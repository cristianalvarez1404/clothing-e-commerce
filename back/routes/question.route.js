import express from "express";
import {
  createAnswerForQuestion,
  createQuestion,
  getQuestions,
} from "../controllers/question.controller.js";
import { validateUserRole } from "../middlewares/validateUserRole.js";

const questionRouter = express.Router();

questionRouter.post("/", createQuestion);
questionRouter.post("/:id", validateUserRole, createAnswerForQuestion);
questionRouter.get("/", validateUserRole, getQuestions);

export { questionRouter };
