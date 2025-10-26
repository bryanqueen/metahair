import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin-session')

    return NextResponse.json({ 
      success: true, 
      message: "Logout successful" 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Logout failed" 
    }, { status: 500 })
  }
}
