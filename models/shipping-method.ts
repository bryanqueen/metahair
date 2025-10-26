import mongoose from "mongoose"

const shippingMethodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: String,
    estimatedDays: Number,
  },
  { timestamps: true },
)

export const ShippingMethod = mongoose.models.ShippingMethod || mongoose.model("ShippingMethod", shippingMethodSchema)
