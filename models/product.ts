import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    shortDescription: String,
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [String],
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    salePrice: {
      type: Number,
    },
    saleStart: {
      type: Date,
    },
    saleEnd: {
      type: Date,
    },
  },
  { timestamps: true },
)

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema)
