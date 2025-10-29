import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectDB } from "@/lib/db"
import { AdminSettings } from "@/models/admin-settings"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { adminEmail } = await request.json()

    if (!adminEmail || typeof adminEmail !== "string" || !adminEmail.includes("@")) {
      return NextResponse.json({ success: false, message: "Invalid email" }, { status: 400 })
    }

    // Require admin session
    const cookieStore = await cookies()
    const session = cookieStore.get("admin-session")
    if (session?.value !== "authenticated") {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    let adminSettings = await AdminSettings.findOne()
    if (!adminSettings) {
      adminSettings = new AdminSettings({ adminEmail, adminPin: "123456" })
    } else {
      adminSettings.adminEmail = adminEmail
    }
    await adminSettings.save()

    return NextResponse.json({ success: true, adminEmail: adminSettings.adminEmail })
  } catch (error) {
    console.error("Update email error:", error)
    return NextResponse.json({ success: false, message: "Failed to update email" }, { status: 500 })
  }
}


