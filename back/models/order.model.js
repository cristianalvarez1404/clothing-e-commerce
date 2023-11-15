import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  products: {
    type: [
      {
        id: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],
    validate: {
      validator: function () {
        let validateProduct = true;
        for (let i = 0; i < this.products.length; i++) {
          if (
            this.products[i].quantity * this.products[i].price ===
            this.products[i].total
          ) {
            continue;
          } else {
            validateProduct = false;
            break;
          }
        }
        return validateProduct;
      },
      message: `Please, check the total for your unit product}`,
    },

    required: [true, `You have to assign a products`],
  },
  quantityArticules: {
    type: Number,
    min: 1,
    validate: {
      validator: function () {
        let total = 0;
        this.products.map((product) => (total += product.quantity));
        return this.quantityArticules === total;
      },
      message: `Please, check the total articules for your products`,
    },
    required: [true, `Quantity must be at least 1 product`],
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "dispatched", "delivered", "rejected"],
    default: "pending",
  },
  totalPurchase: {
    type: Number,
    min: 0,
    validate: {
      validator: function () {
        let total = 0;
        this.products.map((product) => (total += product.total));
        return this.totalPurchase === total;
      },
      message: `Please, check the total purchase for your products`,
    },

    required: [true, `Please, assign total purchase`],
  },
  customerId: {
    type: String,
    required: [true, `You have to assign customer id`],
  },
});

export const OrderModel = mongoose.model("Order", OrderSchema);
