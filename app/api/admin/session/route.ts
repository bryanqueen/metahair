import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectDB } from "@/lib/db"
import { AdminSettings } from "@/models/admin-settings"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin-session')

    if (session?.value === 'authenticated') {
      await connectDB()
      // Get admin settings from database
      const adminSettings = await AdminSettings.findOne()
      
      return NextResponse.json({ 
        authenticated: true, 
        pin: adminSettings?.adminPin || "123456",
        adminEmail: adminSettings?.adminEmail || "admin@metahair.com"
      })
    }

    return NextResponse.json({ 
      authenticated: false 
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ 
      authenticated: false 
    })
  }
}
