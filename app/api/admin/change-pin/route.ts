import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// In a real app, you'd store this in a database
let ADMIN_PIN = "123456"

export async function POST(request: NextRequest) {
  try {
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

    // Validate new PIN (no need to verify old PIN if already authenticated)
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      return NextResponse.json({ 
        success: false, 
        message: "New PIN must be 6 digits" 
      }, { status: 400 })
    }

    // Update PIN
    ADMIN_PIN = newPin

    return NextResponse.json({ 
      success: true, 
      pin: ADMIN_PIN,
      message: "PIN changed successfully" 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Failed to change PIN" 
    }, { status: 500 })
  }
}
