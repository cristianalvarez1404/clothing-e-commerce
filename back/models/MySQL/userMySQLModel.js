import {
  errorMessages,
  validateEmailfield,
  validateEmptyfield,
  validateNumberField,
  validateStringfield,
} from "../../utilities/validateModelFields.js";
import { connection } from "../../config/dbSQL.js";
import jwt from "jsonwebtoken";

const connectionSQL = await connection();

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
      await connectionSQL.query(
        `insert into user(first_name,last_name,email,phone,password,user_type_id) values 
    (?,?,?,?,AES_ENCRYPT(?,'123456789'),?);
  `,
        [firstName, lastName, email, phone, password, role]
      );

      const [lastUserInserted] = await connectionSQL.query(
        `SELECT u.user_id,u.first_name,u.last_name,u.email,u.phone,AES_DECRYPT(password,'123456789') as password,ut.typeUser ,u.created_at ,u.updated_at FROM user u 
          INNER JOIN user_type ut ON u.user_type_id = ut.user_type_id
	        HAVING  u.user_id = LAST_INSERT_ID();`
      );

      this.user = lastUserInserted[0];

      return lastUserInserted;
    } catch (err) {
      throw new Error(err);
    }
  } //

  static async updateUser(firstName, lastName, email, phone, password, role) {
    const requiredFields = {};

    const stringFields = {
      firstName,
      lastName,
      email,
      phone,
      password,
    };

    const emailFields = { email };
    const numberFields = { role };

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
      if (!(userField in requiredFields) && !emailFields[userField]) {
        continue;
      } else {
        if (!validateEmailfield(emailFields[userField])) {
          return errorMessages.isAEmailField(userField);
        }
      }
    }

    for (const userField in numberFields) {
      if (!(userField in requiredFields) && !emailFields[userField]) {
        continue;
      } else {
        if (!validateNumberField(numberFields[userField])) {
          return errorMessages.isANumberField(userField);
        }
      }
    }

    console.log("Testing true");
  }

  static async findUserById(id) {
    try {
      const [user] = await connectionSQL.query(
        `SELECT u.user_id,u.first_name,u.last_name,u.email,u.phone,ut.typeUser ,u.created_at ,u.updated_at FROM user u 
          INNER JOIN user_type ut ON u.user_type_id = ut.user_type_id
	        HAVING  u.user_id = ?;`,
        [id]
      );
      return user;
    } catch (err) {
      throw new Error(err);
    }
  } //

  static async deleteUserById() {
    // return await this.user.deleteOne();
  }

  static async findUserByField(field, value) {
    try {
      const [user] = await connectionSQL.query(
        `SELECT u.user_id,u.first_name,u.last_name,u.email,u.phone,ut.typeUser ,u.created_at ,u.updated_at FROM user u 
            INNER JOIN user_type ut ON u.user_type_id = ut.user_type_id
            HAVING  u.${field} = ?;`,
        [value]
      );
      return user;
    } catch (err) {
      throw new Error(err);
    }

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
    const genereteToken = async function (user) {
      const tokenSession = jwt.sign(user, process.env.JWT_USER, {
        expiresIn: "24h",
      });
      return tokenSession;
    };

    const tokenSession = await genereteToken({
      _id: this.user.user_id || this.user._id,
      email: this.user.email,
      password: this.user.password,
      role: this.user.role,
    });

    return tokenSession;
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
