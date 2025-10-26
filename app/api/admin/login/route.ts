import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// In a real app, you'd store this in a database
const ADMIN_PIN = "123456"

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (pin === ADMIN_PIN) {
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
        pin: ADMIN_PIN,
        message: "Login successful" 
      })
    }

    return NextResponse.json({ 
      success: false, 
      message: "Invalid PIN" 
    }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Login failed" 
    }, { status: 500 })
  }
}
