import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

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
        res.status(400).json({
          success: false,
          message: err.message,
        });
      }
    });
  } else {
    return res.status(400).json({
      success: false,
      message: `You have to login`,
    });
  }
};

export { validateUserRole };
