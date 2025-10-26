import { connectDB } from "@/lib/db"
import { ShippingMethod } from "@/models/shipping-method"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const methods = await ShippingMethod.find().sort({ createdAt: -1 })
    return NextResponse.json(methods)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shipping methods" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()

    const method = new ShippingMethod({
      name: data.name,
      price: data.price,
      description: data.description,
      estimatedDays: data.estimatedDays,
    })

    await method.save()
    return NextResponse.json(method, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create shipping method" }, { status: 500 })
  }
}
