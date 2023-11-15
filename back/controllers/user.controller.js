import User from "../models/user.model.js";

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    const userData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
    };

    const user = await User.create(userData);

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new Error(`Email does not exist!!!`);

    const tokenSession = await user.genereteToken({
      _id: user._id,
      email: user.email,
      password: user.password,
      role: user.role,
      password: user.password,
    });

    const validatePassword = await user.validatePassword(
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
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) throw new Error(`User does not exist!`);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const logoutSession = async (req, res, next) => {
  try {
    res
      .cookie("user-id", ``, {
        expire: Date.now(),
        httpOnly: true,
      })
      .status(200)
      .json({ success: true, message: `Logout succesfull 🚀` });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { firstName, lastName, email, phone, password, role } = req.body;

    const user = await User.findOne({ _id: id });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.password = password || user.password;
    user.role = role || user.role;

    await user.save();
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: `User deleted succesfully 👌`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  createUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  logoutSession,
  deleteUser,
};
