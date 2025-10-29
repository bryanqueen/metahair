import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectDB } from "@/lib/db"
import { AdminSettings } from "@/models/admin-settings"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { pin } = await request.json()

    // Get admin settings from database
    let adminSettings = await AdminSettings.findOne()
    
    // If no admin settings exist, create default one
    if (!adminSettings) {
      adminSettings = new AdminSettings({
        adminEmail: "admin@metahair.com",
        adminPin: "123456"
      })
      await adminSettings.save()
    }

    if (pin === adminSettings.adminPin) {
      // Set session cookie
      const cookieStore = await cookies()
      cookieStore.set('admin-session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      return NextResponse.json({ 
        success: true, 
        pin: adminSettings.adminPin,
        message: "Login successful" 
      })
    }

    return NextResponse.json({ 
      success: false, 
      message: "Invalid PIN" 
    }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false, 
      message: "Login failed" 
    }, { status: 500 })
  }
}
