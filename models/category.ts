import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    // description: String,
  },
  { timestamps: true },
)

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema)
