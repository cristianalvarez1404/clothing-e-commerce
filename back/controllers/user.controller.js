import { ErrorHandler } from "../utilities/ErrorHandler.js";
import { UserClass } from "../models/MongoDB/userMongoModel.js";

export class UserController {
  static async createUser(req, res, next) {
    try {
      const { firstName, lastName, email, phone, password, role } = req.body;

      const user = await UserClass.createUser(
        firstName,
        lastName,
        email,
        phone,
        password,
        role
      );

      res.status(200).json({ success: true, user });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserClass.findUserByField("email", email);

      if (!user) throw new Error(`Email does not exist!!!`);

      const tokenSession = await UserClass.generateTokenUser();

      const validatePassword = await UserClass.validatePasswordUser(
        tokenSession,
        password
      );

      if (!validatePassword) {
        throw new Error(`Credentias are wrong,please check it`);
      }

      const cookieDaysExpire = 1000 * 60 * 60 * 24;
      const cookieDateExpire = new Date() + cookieDaysExpire;

      res
        .cookie("user-id", `${tokenSession}`, {
          expire: cookieDateExpire,
          httpOnly: true,
        })
        .status(200)
        .json({ success: true, message: `Succesfull login 🚀` });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async getUsers(req, res, next) {
    try {
      const users = await UserClass.getAllUsers();

      res.status(200).json({
        success: true,
        users,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const { id: idSession, role } = req.userSession;

      const user = await UserClass.findUserById(id);

      if (!user) throw new Error(`User does not exist!`);

      if (user._id.toString() !== idSession && role === "client")
        throw new Error(`You are not authorized`);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async logoutSession(req, res, next) {
    try {
      req.userSession = null;

      UserClass.resetUser();

      res
        .cookie("user-id", ``, {
          expire: Date.now(),
          httpOnly: true,
        })
        .status(200)
        .json({ success: true, message: `Logout succesfull 🚀` });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;

      const { firstName, lastName, email, phone, password, role } = req.body;

      let user = await UserClass.findUserById(id);

      user = await UserClass.updateUser(
        firstName,
        lastName,
        email,
        phone,
        password,
        role
      );

      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      await UserClass.findUserById(id);

      await UserClass.deleteUserById();

      res.status(200).json({
        success: true,
        message: `User deleted succesfully 👌`,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //
}
