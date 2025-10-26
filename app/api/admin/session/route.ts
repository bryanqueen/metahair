import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In a real app, you'd store this in a database
const ADMIN_PIN = "123456"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin-session')

    if (session?.value === 'authenticated') {
      return NextResponse.json({ 
        authenticated: true, 
        pin: ADMIN_PIN 
      })
    }

    return NextResponse.json({ 
      authenticated: false 
    })
  } catch (error) {
    return NextResponse.json({ 
      authenticated: false 
    })
  }
}
