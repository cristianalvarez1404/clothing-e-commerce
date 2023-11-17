import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utilities/ErrorHandler.js";

const validateUserRole = async (req, res, next) => {
  const userToken = req.cookies["user-id"];

  if (userToken) {
    jwt.verify(userToken, process.env.JWT_USER, async (err, data) => {
      try {
        if (err) throw new Error(`Invalid token`);

        const user = await User.findOne({ _id: data._id });

        if (!user) throw new Error(`User does not exist!`);

        if (user.role !== "admin" && data.role !== "admin") {
          throw new Error(`User unauthorized!`);
        }

        req.userSession = { id: data._id, role: data.role };

        next();
      } catch (err) {
        next(new ErrorHandler(err.message, 400));
      }
    });
  } else {
    const err = new Error(`You have to login`);
    next(new ErrorHandler(err.message, 400));
  }
};

export { validateUserRole };
