import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: [0, `Your number can not be less than 0, please check it`],
      required: [true, `Price field is required`],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [0, `Your number can not be less than 0, please check it`],
      required: [true, `Quantity field is required`],
    },
    description: {
      type: String,
      required: [true, `You must to assign a description for your product`],
    },
    images: {
      type: [String],
      required: [true, `You have to assign at least one image`],
    },
    typeProduct: {
      type: [String],
      enum: ["male", "women", "kid"],
      required: [true, `You have to choose one type for your product`],
    },
    category: {
      type: [String],
      enum: ["winter", "summer", "spring", "autumn"],
      required: [true, `You have to choose one category for your product`],
    },
    size: {
      type: [Number],
      enum: [35, 36, 37, 38, 39, 40, 41, 42],
      required: [true, `You have to choose one size for your product`],
    },
    color: {
      type: [String],
      enum: [`black`, `white`, `red`, `gray`, `blue`, `orange`, `purple`],
      required: [true, `You have to choose one color for your product`],
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalRefund: {
      type: Number,
      default: 0,
    },
    review: {
      type: [
        {
          idUser: {
            type: String,
          },
          score: {
            type: Number,
            min: [0, `Your score can not be less than 0`],
            max: [5, `Your score can not be more than 5`],
          },
          comment: {
            type: String,
          },
        },
      ],
    },
    averageScore: {
      type: Number,
      min: [0, `Your score can not be less than 0`],
      max: [5, `Your score can not be more than 5`],
      default: 5,
    },
    promotion: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.model("Product", ProductSchema);
