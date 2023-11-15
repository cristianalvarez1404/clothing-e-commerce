import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const validateUserUpdate = async (req, res, next) => {
  const userToken = req.cookies["user-id"];
  const { id } = req.params;

  if (userToken) {
    jwt.verify(userToken, process.env.JWT_USER, async (err, data) => {
      try {
        if (err) throw new Error(`Invalid token`);

        const user = await User.findOne({ _id: data._id });

        if (!user) throw new Error(`User does not exist!`);

        if (id !== user._id.toString() && user.role !== "admin")
          throw new Error(`User unauthorized!`);

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

export { validateUserUpdate };
