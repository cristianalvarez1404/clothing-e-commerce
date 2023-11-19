import userModel from "../../schemas/MongoDB/userMongoSchema.js";

export class UserClass {
  static async createUser(firstName, lastName, email, phone, password, role) {
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
    };

    return await userModel.create(userData);
  }

  static async updateUser(firstName, lastName, email, phone, password, role) {
    this.user.firstName = firstName || this.user.firstName;
    this.user.lastName = lastName || this.user.lastName;
    this.user.email = email || this.user.email;
    this.user.phone = phone || this.user.phone;
    this.user.password = password || this.user.password;
    this.user.role = role || this.user.role;
    return await this.user.save();
  }

  static async findUserById(id) {
    const user = await userModel.findById(id);
    this.user = user;
    return user;
  }

  static async deleteUserById() {
    return await this.user.deleteOne();
  }

  static async findUserByField(field, value) {
    const user = await userModel
      .findOne({ [field]: value })
      .select("+password");
    this.user = user;
    return user;
  }

  static async updateUserOrders(orders, newOrderId) {
    await this.user.updateOne({ orders: [...orders, newOrderId] });
  }

  static async generateTokenUser() {
    const tokenSession = await this.user.genereteToken({
      _id: this.user._id,
      email: this.user.email,
      password: this.user.password,
      role: this.user.role,
      password: this.user.password,
    });
    return tokenSession;
  }

  static async validatePasswordUser(token, password) {
    return await this.user.validatePassword(token, password);
  }

  static async getAllUsers() {
    return await userModel.find();
  }

  static resetUser() {
    this.user = null;
  }
}
