import { OrderModel } from "../../schemas/MongoDB/orderMongoSchema.js";
import { ValidateFieldsModel } from "../../utilities/validateModelFields.js";

export class OrderClass {
  static async createOrder(
    products,
    quantityArticules,
    state,
    totalPurchase,
    customerId
  ) {
    const newOrder = {
      products: ValidateFieldsModel.isEmpty(),
      quantityArticules: ValidateFieldsModel.isEmpty(),
      state: ValidateFieldsModel.isEmpty(),
      totalPurchase: ValidateFieldsModel.isEmpty(),
      customerId: ValidateFieldsModel.isEmpty(),
    };

    const validate = Object.values(newOrder).filter(
      (field) => field.success === false
    );

    if (validate.length > 0) return validate;

    // return await OrderModel.create(newOrder);
  }

  static async findOrderById(id) {
    // const order = await OrderModel.findOne({ _id: id });
    this.order = order;
    return order;
  }

  static async saveOrder() {
    // return await this.order.save();
  }

  static async getAllOrders() {
    // return await OrderModel.find();
  }

  static async deleteOrder() {
    // return await this.order.deleteOne();
  }

  static async updateOrderStatus(status) {
    this.order.status = status;
    // return await this.order.save();
  }
}
