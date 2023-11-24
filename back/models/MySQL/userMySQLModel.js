import {
  errorMessages,
  validateEmailfield,
  validateEmptyfield,
  validateStringfield,
} from "../../utilities/validateModelFields.js";
import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "ecommerce",
};

const connection = await mysql.createConnection(config);

export class UserClass {
  static async createUser(firstName, lastName, email, phone, password, role) {
    const requiredFields = { firstName, lastName, email, password };

    const stringFields = {
      firstName,
      lastName,
      email,
      phone,
      password,
    };

    const emailFields = { email };

    Object.freeze(requiredFields);
    Object.freeze(stringFields);
    Object.freeze(emailFields);

    for (const userField in requiredFields) {
      if (!validateEmptyfield(requiredFields[userField])) {
        return errorMessages.emptyField(userField);
      }
    }

    for (const userField in stringFields) {
      if (!(userField in requiredFields) && !stringFields[userField]) {
        continue;
      } else {
        if (!validateStringfield(stringFields[userField])) {
          return errorMessages.isStringField(userField);
        }
      }
    }

    for (const userField in emailFields) {
      if (!validateEmailfield(emailFields[userField])) {
        return errorMessages.isAEmailField(userField);
      }
    }

    try {
      await connection.query(
        `insert into user(first_name,last_name,email,phone,password,user_type_id) values 
    (?,?,?,?,?,?);
  `,
        [firstName, lastName, email, phone, password, role]
      );

      const [lastUserInserted] = await connection.query(
        `SELECT * FROM user WHERE user_id = LAST_INSERT_ID();`
      );

      return lastUserInserted;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async updateUser(firstName, lastName, email, phone, password, role) {
    // this.user.firstName = firstName || this.user.firstName;
    // this.user.lastName = lastName || this.user.lastName;
    // this.user.email = email || this.user.email;
    // this.user.phone = phone || this.user.phone;
    // this.user.password = password || this.user.password;
    // this.user.role = role || this.user.role;
    // return await this.user.save();
  }

  static async findUserById(id) {
    // const user = await userModel.findById(id);
    // this.user = user;
    // return user;
  }

  static async deleteUserById() {
    // return await this.user.deleteOne();
  }

  static async findUserByField(field, value) {
    // const user = await userModel
    //   .findOne({ [field]: value })
    //   .select("+password");
    // this.user = user;
    // return user;
  }

  static async updateUserOrders(orders, newOrderId) {
    // await this.user.updateOne({ orders: [...orders, newOrderId] });
  }

  static async generateTokenUser() {
    // const tokenSession = await this.user.genereteToken({
    //   _id: this.user._id,
    //   email: this.user.email,
    //   password: this.user.password,
    //   role: this.user.role,
    //   password: this.user.password,
    // });
    // return tokenSession;
  }

  static async validatePasswordUser(token, password) {
    // return await this.user.validatePassword(token, password);
  }

  static async getAllUsers() {
    // return await userModel.find();
  }

  static resetUser() {
    // this.user = null;
  }
}
