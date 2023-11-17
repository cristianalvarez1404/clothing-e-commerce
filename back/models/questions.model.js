import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    userId: {
      type: String || null,
    },
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
    question: {
      type: String,
      required: [true, "You have to assign a question"],
    },
    description: {
      type: String,
    },
    answer: {
      type: {
        idAdmin: String,
        answer: String,
        dateAnswer: Date,
      },
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const questionModel = mongoose.model("Question", questionSchema);
