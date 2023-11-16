import { OrderModel } from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";
import userModel from "../models/user.model.js";

const createOrder = async (req, res, next) => {
  try {
    const { products, quantityArticules, state, totalPurchase, customerId } =
      req.body;

    const idUser = req.userSession.id;

    const user = await userModel.findById(idUser);

    if (!user) throw new Error(`User does not exist!`);

    if (idUser !== customerId)
      throw new Error(
        `Your customerId ${customerId} is invalid,please validate with your own id`
      );

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

    await user.updateOne({ orders: [...user.orders, order._id] });

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
    let { id, role } = req.userSession;

    let orders = [];

    role === "admin"
      ? (orders = await OrderModel.find())
      : (orders = (await OrderModel.find()).filter(
          (order) => order.customerId === id && role === "client"
        ));

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
    const id = req.query.id;

    let orders = [];

    id
      ? (orders = (await OrderModel.find()).filter(
          (order) => order.customerId === id
        ))
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

const updateOrderUser = async (req, res, next) => {
  try {
    const { id, role } = req.userSession;
    const { idOrder } = req.params;
    const { products, quantityArticules, totalPurchase, customerId } = req.body;

    const order = await OrderModel.findOne({ _id: idOrder });

    if (!order) throw new Error(`Order does not exist`);

    if (order.customerId !== id && role === "client")
      throw new Error(`You aren't authorized for this order`);

    for (const productOrder of order.products) {
      let updateQuantityProduct = await ProductModel.findById(productOrder.id);
      console.log(productOrder.quantity);
      updateQuantityProduct.quantity =
        updateQuantityProduct.quantity + productOrder.quantity;

      await updateQuantityProduct.save();
    }

    for (const newProductOrder of products) {
      let newUpdateQuantityProduct = await ProductModel.findById(
        newProductOrder.id
      );
      console.log(newProductOrder.quantity);
      if (!newUpdateQuantityProduct)
        throw new Error(`Product with id ${newProductOrder.id} does not exist`);

      newUpdateQuantityProduct.quantity =
        newUpdateQuantityProduct.quantity - newProductOrder.quantity;

      if (newUpdateQuantityProduct.quantity < 0)
        throw new Error(`Product with id ${newProductOrder.id} have not stock`);

      await newUpdateQuantityProduct.save();
    }

    order.products = products;
    order.quantityArticules = quantityArticules;
    order.totalPurchase = totalPurchase;
    order.customerId = customerId;

    await order.save();

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

export {
  createOrder,
  updateStatusOrder,
  getOrders,
  getOrdersForAdmin,
  updateOrderUser,
};
