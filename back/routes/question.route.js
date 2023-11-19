import express from "express";
import { QuestionController } from "../controllers/question.controller.js";
import { validateUserRole } from "../middlewares/validateUserRole.js";

const questionRouter = express.Router();

questionRouter.post("/", QuestionController.createQuestion);
questionRouter.post(
  "/:id",
  validateUserRole,
  QuestionController.createAnswerForQuestion
);
questionRouter.get("/", validateUserRole, QuestionController.getQuestions);

export { questionRouter };
