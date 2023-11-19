import { questionModel } from "../../schemas/MongoDB/questionMongoSchema.js";

export class QuestionClass {
  static async createQuestion(
    userId,
    firstName,
    lastName,
    email,
    phone,
    question,
    description
  ) {
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
    return newQuestion;
  }

  static async findQuestionById(id) {
    const question = await questionModel.findOne({ _id: id });
    this.question = question;
    return question;
  }

  static async createQuestionAnswer(idSession, answer) {
    const newAnswer = {
      idAdmin: idSession,
      answer,
      dateAnswer: new Date().toDateString(),
    };

    this.question.answer = newAnswer;

    return await this.question.save();
  }

  static async getAllQuestions() {
    return await questionModel.find();
  }
}
