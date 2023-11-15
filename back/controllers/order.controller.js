import { OrderModel } from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";
import userModel from "../models/user.model.js";

const createOrder = async (req, res, next) => {
  try {
    const { products, quantityArticules, state, totalPurchase, customerId } =
      req.body;

    const newOrder = {
      products,
      quantityArticules,
      state,
      totalPurchase,
      customerId,
    };

    const order = await OrderModel.create(newOrder);

    for (const productOrder of products) {
      let updateQuantityProduct = await ProductModel.findById(productOrder.id);
      if (!updateQuantityProduct)
        throw new Error(`Product with id ${productOrder.id} does not exist`);

      updateQuantityProduct.quantity =
        updateQuantityProduct.quantity - productOrder.quantity;

      if (updateQuantityProduct.quantity < 0)
        throw new Error(`Product with id ${productOrder.id} have not stock`);

      await updateQuantityProduct.save();
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updateStatusOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const order = await OrderModel.findOne({ _id: id });

    if (!order) throw new Error(`Order ${id} does not exist`);

    const customer = await userModel.findById(order.customerId);

    if (!customer)
      throw new Error(`Customer does not authorized for updated this purchase`);

    if (order.status === "delivered" || order.status === "rejected")
      throw new Error(`Product has been updated with status "${status}"`);

    await order.save();

    res.status(200).json({
      success: true,
      message: `Your order ${id} is modified to ${status}`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("hola otra vez");

    const orders = (await OrderModel.find()).filter(
      (order) => order.customerId === id
    );

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getOrdersForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    let orders = [];

    id
      ? (orders = await OrderModel.findById(id))
      : (orders = await OrderModel.find());

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export { createOrder, updateStatusOrder, getOrders, getOrdersForAdmin };
