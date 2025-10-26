import mongoose from "mongoose"

const adminSettingsSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: true,
    },
    adminPin: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export const AdminSettings = mongoose.models.AdminSettings || mongoose.model("AdminSettings", adminSettingsSchema)
