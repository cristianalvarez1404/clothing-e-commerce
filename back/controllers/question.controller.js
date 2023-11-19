import { ErrorHandler } from "../utilities/ErrorHandler.js";
import { QuestionClass } from "../models/MongoDB/questionMongoModel.js";

export class QuestionController {
  static async createQuestion(req, res, next) {
    try {
      const {
        userId,
        firstName,
        lastName,
        email,
        phone,
        question,
        description,
      } = req.body;

      const newQuestion = await QuestionClass.createQuestion(
        userId,
        firstName,
        lastName,
        email,
        phone,
        question,
        description
      );

      res.status(200).json({
        success: true,
        message: newQuestion,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  }

  static async createAnswerForQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const { id: idSession, role } = req.userSession;
      const { answer } = req.body;

      if (role !== "admin") throw new Error(`You are not authorized`);

      const question = await QuestionClass.findQuestionById(id);

      if (!question) throw new Error(`Question ${id} does not exist,sorry!`);

      if (question.answer)
        throw new Error(`Question'answer with id ${id} already exist`);

      await QuestionClass.createQuestionAnswer(idSession, answer);

      res.status(200).json({
        success: true,
        question,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  }

  static async getQuestions(req, res, next) {
    try {
      const questions = await QuestionClass.getAllQuestions();

      res.status(200).json({
        success: true,
        questions,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  }
}
