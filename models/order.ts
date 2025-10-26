import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    shippingAddress: String,
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        productName: String,
        quantity: Number,
        price: Number,
      },
    ],
    shippingMethod: String,
    shippingCost: Number,
    subtotal: Number,
    total: Number,
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentReference: String,
  },
  { timestamps: true },
)

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)
