import { ErrorHandler } from "../utilities/ErrorHandler.js";
import { OrderClass } from "../models/MongoDB/orderMongoModel.js";
import { ProductClass } from "../models/MongoDB/productMongoModel.js";

export class ProductController {
  static async createProduct(req, res, next) {
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

      const product = await ProductClass.createProduct(
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
        promotion
      ); //

      res.status(201).json({
        success: true,
        product,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async updateProduct(req, res, next) {
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

      const product = await ProductClass.findProductById(id); //

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

      await ProductClass.saveProduct(); //

      res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      await ProductClass.findProductByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: `Product was deleted successfully 🧨👌`,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async getProducts(req, res, next) {
    try {
      const { promotion, typeProduct } = req.query;

      let products = [];

      switch (typeProduct || promotion || products) {
        //pass promition=true&typeProduct = male | women | kid
        case promotion && typeProduct: {
          products = (await ProductClass.findAllProducts()).filter(
            (product) =>
              product.typeProduct.includes(typeProduct) && product.promotion
          );
          break;
        }
        case promotion: {
          // pass promotion=true
          products = await ProductClass.findAllProductsInPromotion(promotion);
          break;
        }

        case typeProduct: {
          // pass typeProduct=kid | male | woman
          products = (await ProductClass.findAllProducts()).filter((product) =>
            product.typeProduct.includes(typeProduct)
          );
          break;
        }

        default: {
          products = await ProductClass.findAllProducts();
          break;
        }
      }

      res.status(200).json({
        success: true,
        products,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async getProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await ProductClass.findProductById(id);

      res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async addReviewProduct(req, res, next) {
    try {
      const { id: idProduct } = req.params;

      const { id, role } = req.userSession;

      const { idUser, score, comment } = req.body;

      const product = await ProductClass.findProductById(idProduct);

      if (!product)
        throw new Error(`Product with id ${idProduct} does not exist`);

      for (const userProduct of product.review) {
        if (userProduct.idUser === idUser) {
          throw new Error(`User already has created a review.`);
        }
      }

      if (idUser !== id)
        throw new Error(`You have to login with your own account`);

      const order = (await OrderClass.getAllOrders()).filter(
        (orderUser) => orderUser.customerId === idUser
      );

      if (!order) throw new Error(`You have not bought products yet`);

      let userHasOrder = false;
      for (const unitOrder of order) {
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

      if (!userHasOrder)
        throw new Error(`You have not bought this product yet`);

      await ProductClass.createProductReview(idUser, score, comment);

      let totalScore = 0;

      for (const newAverage of product.review) {
        totalScore += newAverage.score;
      }

      await ProductClass.updateProductScore(totalScore);

      await product.save();
      res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //

  static async updateReview(req, res, next) {
    try {
      const { id: idSession, role } = req.userSession;
      const { id } = req.params;
      const { idUser: idUserReview, score, comment } = req.body;

      if (idUserReview !== idSession)
        throw new Error(`You are not authorized for update this review`);

      const product = await ProductClass.findProductById(id);

      if (!product) throw new Error(`Product does not exist`);

      let userHasReview = false;

      for (const review of product.review) {
        if (review.idUser === idSession) {
          userHasReview = true;
          review.score = score;
          review.comment = comment;
        }
      }

      if (!userHasReview)
        throw new Error(`You have not reviews in this product`);

      let totalScore = 0;

      for (const newAverage of product.review) {
        totalScore += newAverage.score;
      }

      await ProductClass.updateProductScore(totalScore);

      res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 400));
    }
  } //
}
