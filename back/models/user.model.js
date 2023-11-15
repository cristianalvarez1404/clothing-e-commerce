import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "You have to assign a name"],
      validate: {
        validator: function () {
          return this.firstName.length > 3;
        },
        message: `First name too short,must be at least 3 characters`,
      },
    },
    lastName: {
      type: String,
      required: [true, "You have to assign a last name"],
      validate: {
        validator: function () {
          return this.lastName.length > 3;
        },
        message: `Last name too short,must be at least 3 characters`,
      },
    },
    email: {
      type: String,
      unique: true,
      required: [true, "You have to assign an email"],
      validate: {
        validator: function () {
          const emailFormat =
            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
          if (this.email !== "" && this.email.match(emailFormat)) {
            return true;
          }
          return false;
        },
        message: `Invalid Email`,
      },
    },
    phone: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      select: false,
      required: [true, "You have to assign a password"],
      validate: {
        validator: function () {
          return this.password.length > 5;
        },
        message: `Password too short,must be at least 5 characters`,
      },
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.genereteToken = function (user) {
  const tokenSession = jwt.sign(user, process.env.JWT_USER, {
    expiresIn: "24h",
  });
  return tokenSession;
};

userSchema.methods.validatePassword = async function (tokenSession, password) {
  let isValidPassword = null;

  await jwt.verify(tokenSession, process.env.JWT_USER, async (err, data) => {
    if (err) return new Error(`You are not authorized!!!`);
    isValidPassword = await bcrypt.compare(password, data.password);
  });

  return isValidPassword;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
