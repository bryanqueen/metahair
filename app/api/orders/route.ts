import { connectDB } from "@/lib/db"
import { Order } from "@/models/order"
import { sendOrderConfirmation } from "@/lib/email"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit
    const orders = await Order.find().skip(skip).limit(limit).sort({ createdAt: -1 })
    const total = await Order.countDocuments()

    return NextResponse.json({
      orders,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()

    const orderNumber = `MH-${Date.now()}`

    const order = new Order({
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      items: data.items,
      shippingMethod: data.shippingMethod,
      shippingCost: data.shippingCost,
      subtotal: data.subtotal,
      total: data.total,
      paymentReference: data.paymentReference,
    })

    await order.save()

    // Send confirmation emails
    const adminEmail = process.env.ADMIN_EMAIL || "admin@metahair.com"

    await sendOrderConfirmation(data.customerEmail, adminEmail, {
      orderNumber,
      customerName: data.customerName,
      items: data.items,
      total: data.total,
      shippingMethod: data.shippingMethod,
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
