import { connectDB } from "@/lib/db"
import { ShippingMethod } from "@/models/shipping-method"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params
    const data = await request.json()

    const method = await ShippingMethod.findByIdAndUpdate(id, data, { new: true })

    if (!method) {
      return NextResponse.json({ error: "Shipping method not found" }, { status: 404 })
    }

    return NextResponse.json(method)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update shipping method" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const method = await ShippingMethod.findByIdAndDelete(id)

    if (!method) {
      return NextResponse.json({ error: "Shipping method not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Shipping method deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete shipping method" }, { status: 500 })
  }
}
