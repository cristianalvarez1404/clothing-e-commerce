import { OrderModel } from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";

ProductModel;

const createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      price,
      quantity,
      description,
      images,
      typeProduct,
      category,
      size,
      color,
      review,
      promotion,
    } = req.body;

    const productFields = {
      productName,
      price,
      quantity,
      description,
      images,
      typeProduct,
      category,
      size,
      color,
      review,
      promotion,
    };

    const product = await ProductModel.create(productFields);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      productName,
      price,
      quantity,
      description,
      images,
      typeProduct,
      category,
      size,
      color,
      review,
      promotion,
    } = req.body;

    const product = await ProductModel.findOne({ _id: id });

    product.productName = productName || product.productName;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.description = description || product.description;
    product.images = images || product.images;
    product.typeProduct = typeProduct || product.typeProduct;
    product.category = category || product.category;
    product.size = size || product.size;
    product.color = color || product.color;
    product.review = review || product.review;
    product.promotion = promotion || product.promotion;

    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await ProductModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Product was deleted successfully 🧨👌`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { promotion, typeProduct } = req.query;

    let products = [];

    switch (typeProduct || promotion || products) {
      //pass promition=true&typeProduct = male | women | kid
      case promotion && typeProduct: {
        products = (await ProductModel.find()).filter(
          (product) =>
            product.typeProduct.includes(typeProduct) && product.promotion
        );
        break;
      }
      case promotion: {
        // pass promotion=true
        products = await ProductModel.find({ promotion });
        break;
      }

      case typeProduct: {
        // pass typeProduct=kid | male | woman
        products = (await ProductModel.find()).filter((product) =>
          product.typeProduct.includes(typeProduct)
        );
        break;
      }

      default: {
        products = await ProductModel.find();
        break;
      }
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findOne({
      _id: id,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const addReviewProduct = async (req, res, next) => {
  try {
    const { id: idProduct } = req.params;

    const { id, role } = req.userSession;

    const { idUser, score, comment } = req.body;

    const product = await ProductModel.findOne({ _id: idProduct });

    if (!product)
      throw new Error(`Product with id ${idProduct} does not exist`);

    for (const userProduct of product.review) {
      if (userProduct.idUser === idUser) {
        throw new Error(`User already has created a review.`);
      }
    }

    if (idUser !== id)
      throw new Error(`You have to login with your own account`);

    const order = (await OrderModel.find()).filter(
      (orderUser) => orderUser.customerId === idUser
    );

    if (!order) throw new Error(`You have not bought products yet`);

    let userHasOrder = false;
    for (const unitOrder of order) {
      // console.log(unitOrder);
      for (const exitsProduct of unitOrder.products) {
        if (exitsProduct.id === idProduct) {
          userHasOrder = true;
          break;
        }
      }
      if (userHasOrder) {
        break;
      }
    }

    if (!userHasOrder) throw new Error(`You have not bought this product yet`);

    const reviewData = {
      idUser,
      score,
      comment,
    };

    product.review.push(reviewData);

    await product.save();
    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
  addReviewProduct,
};
