import { ProductModel } from "../../schemas/MongoDB/productMongoschema.js";

export class ProductClass {
  static async findProductById(id) {
    const product = await ProductModel.findById(id);
    this.product = product;
    return product;
  }

  static async findProductByIdAndDelete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }

  static async findAllProducts() {
    return await ProductModel.find();
  }

  static async findAllProductsInPromotion(promotion) {
    return await ProductModel.find({ promotion });
  }

  static async saveProduct() {
    return await this.product.save();
  }

  static async updateProductScore(totalScore) {
    this.product.averageScore = Math.round(
      totalScore / this.product.review.length
    );
    return await this.product.save();
  }

  static async createProductReview(idUser, score, comment) {
    const reviewData = {
      idUser,
      score,
      comment,
    };

    this.product.review.push(reviewData);

    return await this.product.save();
  }

  static async createProduct(
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
  ) {
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
    return await ProductModel.create(productFields);
  }
}
