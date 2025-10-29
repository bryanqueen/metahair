import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectDB } from "@/lib/db"
import { AdminSettings } from "@/models/admin-settings"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { newPin } = await request.json()

    // Check if user is authenticated
    const cookieStore = await cookies()
    const session = cookieStore.get('admin-session')

    if (session?.value !== 'authenticated') {
      return NextResponse.json({ 
        success: false, 
        message: "Not authenticated" 
      }, { status: 401 })
    }

    // Validate new PIN
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      return NextResponse.json({ 
        success: false, 
        message: "New PIN must be 6 digits" 
      }, { status: 400 })
    }

    // Update PIN in database
    let adminSettings = await AdminSettings.findOne()
    
    if (!adminSettings) {
      // Create new admin settings if none exist
      adminSettings = new AdminSettings({
        adminEmail: "admin@metahair.com",
        adminPin: newPin
      })
    } else {
      adminSettings.adminPin = newPin
    }
    
    await adminSettings.save()

    return NextResponse.json({ 
      success: true, 
      pin: adminSettings.adminPin,
      message: "PIN changed successfully" 
    })
  } catch (error) {
    console.error('Change PIN error:', error)
    return NextResponse.json({ 
      success: false, 
      message: "Failed to change PIN" 
    }, { status: 500 })
  }
}
