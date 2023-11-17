import { questionModel } from "../models/questions.model.js";
import { ErrorHandler } from "../utilities/ErrorHandler.js";

const createQuestion = async (req, res, next) => {
  try {
    const { userId, firstName, lastName, email, phone, question, description } =
      req.body;

    const questionData = {
      userId: userId || null,
      firstName,
      lastName,
      email,
      phone,
      question,
      description,
    };

    const newQuestion = await questionModel.create(questionData);

    res.status(200).json({
      success: true,
      message: newQuestion,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 400));
  }
};

const createAnswerForQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: idSession, role } = req.userSession;
    const { answer } = req.body;

    if (role !== "admin") throw new Error(`You are not authorized`);

    const question = await questionModel.findOne({ _id: id });

    if (!question) throw new Error(`Question ${id} does not exist,sorry!`);

    if (question.answer)
      throw new Error(`Question'answer with id ${id} already exist`);

    const newAnswer = {
      idAdmin: idSession,
      answer,
      dateAnswer: new Date().toDateString(),
    };

    question.answer = newAnswer;

    await question.save();

    res.status(200).json({
      success: true,
      question,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 400));
  }
};

const getQuestions = async (req, res, next) => {
  try {
    const questions = await questionModel.find();

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 400));
  }
};

export { createQuestion, createAnswerForQuestion, getQuestions };
