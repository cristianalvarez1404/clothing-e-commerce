import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const validateUserLogin = async (req, res, next) => {
  const userToken = req.cookies["user-id"];

  if (userToken) {
    jwt.verify(userToken, process.env.JWT_USER, async (err, data) => {
      try {
        if (err) throw new Error(`Invalid token`);

        const user = await User.findOne({ _id: data._id });

        if (!user) throw new Error(`User does not exist!`);

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

export { validateUserLogin };
