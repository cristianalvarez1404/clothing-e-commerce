import { ErrorHandler } from "../utilities/ErrorHandler.js";
import { OrderClass } from "../models/MongoDB/orderMongoModel.js";
import { ProductClass } from "../models/MongoDB/productMongoModel.js";
import { UserClass } from "../models/MongoDB/userMongoModel.js";

export class OrderController {
  static async createOrder(req, res, next) {
    try {
      const { products, quantityArticules, state, totalPurchase, customerId } =
        req.body;

      const idUser = req.userSession.id;

      const user = await UserClass.findUserById(idUser); //

      if (!user) throw new Error(`User does not exist!`);

      if (idUser !== customerId)
        throw new Error(
          `Your customerId ${customerId} is invalid,please validate with your own id`
        );

      const order = await OrderClass.createOrder(
        products,
        quantityArticules,
        state,
        totalPurchase,
        customerId
      ); //

      for (const productOrder of products) {
        let updateQuantityProduct = await ProductClass.findProductById(
          productOrder.id
        ); //
        if (!updateQuantityProduct)
          throw new Error(`Product with id ${productOrder.id} does not exist`);

        updateQuantityProduct.quantity =
          updateQuantityProduct.quantity - productOrder.quantity;

        if (updateQuantityProduct.quantity < 0)
          throw new Error(`Product with id ${productOrder.id} have not stock`);

        await ProductClass.saveProduct();
      }

      await UserClass.updateUserOrders(user.orders, order._id); //

      res.status(200).json({
        success: true,
        order,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async updateStatusOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.query;

      const order = await OrderClass.findOrderById(id); //

      if (!order) throw new Error(`Order ${id} does not exist`);

      const customer = await UserClass.findUserById(order.customerId); //

      if (!customer)
        throw new Error(
          `Customer does not authorized for updated this purchase`
        );

      if (order.status === "delivered" || order.status === "rejected")
        throw new Error(`Product has been updated with status "${status}"`);

      await OrderClass.updateOrderStatus(status); //

      res.status(200).json({
        success: true,
        message: `Your order ${id} is modified to ${status}`,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async getOrders(req, res, next) {
    try {
      let { id, role } = req.userSession;

      let orders = [];

      role === "admin"
        ? (orders = await OrderClass.getAllOrders())
        : (orders = (await OrderClass.getAllOrders()).filter(
            (order) => order.customerId === id && role === "client"
          )); //

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async getOrdersForAdmin(req, res, next) {
    try {
      const id = req.query.id;

      let orders = [];

      id
        ? (orders = (await OrderClass.getAllOrders()).filter(
            (order) => order.customerId === id
          ))
        : (orders = await OrderClass.getAllOrders());

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async updateOrderUser(req, res, next) {
    try {
      const { id, role } = req.userSession;
      const { idOrder } = req.params;
      const { products, quantityArticules, totalPurchase, customerId } =
        req.body;

      const order = await OrderClass.findOrderById(idOrder); //

      if (!order) throw new Error(`Order does not exist`);

      if (order.customerId !== id && role === "client")
        throw new Error(`You aren't authorized for this order`);

      if (order.status !== "pending")
        throw new Error(
          `Your order ${idOrder} already has been ${order.status}`
        );

      for (const productOrder of order.products) {
        let updateQuantityProduct = await ProductClass.findProductById(
          productOrder.id
        ); //

        updateQuantityProduct.quantity =
          updateQuantityProduct.quantity + productOrder.quantity;

        await ProductClass.saveProduct(); //
      }

      for (const newProductOrder of products) {
        let newUpdateQuantityProduct = await ProductClass.findProductById(
          newProductOrder.id
        ); //

        if (!newUpdateQuantityProduct)
          throw new Error(
            `Product with id ${newProductOrder.id} does not exist`
          );

        newUpdateQuantityProduct.quantity =
          newUpdateQuantityProduct.quantity - newProductOrder.quantity;

        if (newUpdateQuantityProduct.quantity < 0)
          throw new Error(
            `Product with id ${newProductOrder.id} have not stock`
          );

        await ProductClass.saveProduct(); //
      }

      order.products = products;
      order.quantityArticules = quantityArticules;
      order.totalPurchase = totalPurchase;
      order.customerId = customerId;

      await OrderClass.saveOrder(); //

      res.status(200).json({
        success: true,
        order,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async deleteOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { id: idSession, role } = req.userSession;

      const order = await OrderClass.findOrderById({ _id: id }); //

      if (!order) throw new Error(`Order does not exist!`);

      if (order.customerId !== idSession && role === "client")
        throw new Error(`You are not authorized for delete this order`);

      if (order.status !== "pending")
        throw new Error(
          `Order ${id} can not deleted, because its status is ${order.status}`
        );

      for (const productOrder of order.products) {
        let updateQuantityProduct = await ProductClass.findProductById(
          productOrder.id
        ); //
        updateQuantityProduct.quantity =
          updateQuantityProduct.quantity + productOrder.quantity;

        await ProductClass.saveProduct(); //
      }

      await OrderClass.deleteOrder(); //

      res.status(200).json({
        success: true,
        message: `Order ${id} was deleted!`,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //
}
