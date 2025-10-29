import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Order } from "@/models/order"
import { sendOrderConfirmation } from "@/lib/email"
import { AdminSettings } from "@/models/admin-settings"
import { Product } from "@/models/product"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { reference, orderId, customerEmail, customerName } = await request.json()

    if (!reference || !orderId) {
      return NextResponse.json({ success: false, message: "Missing reference or orderId" }, { status: 400 })
    }

    // Verify payment with Paystack
    const secretKey = process.env.PAYSTACK_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ success: false, message: "Missing PAYSTACK_SECRET_KEY" }, { status: 500 })
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
      cache: "no-store"
    })
    const verify = await verifyRes.json()

    if (!verifyRes.ok || verify?.data?.status !== "success") {
      // Mark order as failed
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed", status: "cancelled" })
      return NextResponse.json({ success: false, message: "Verification failed" }, { status: 400 })
    }

    // Update order to completed
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: "completed", status: "processing", paymentReference: reference },
      { new: true }
    )

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    // Reduce stock of purchased products
    try {
      if (order?.items?.length) {
        for (const item of order.items as any[]) {
          if (item.productId) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -Math.abs(item.quantity || 0) } })
          }
        }
      }
    } catch (e) {
      console.error('Stock reduction error:', e)
    }

    // Send confirmation emails
    const settings = await AdminSettings.findOne()
    const adminEmail = settings?.adminEmail || process.env.ADMIN_EMAIL || "admin@metahair.com"

    await sendOrderConfirmation(order.customerEmail || customerEmail, adminEmail, {
      orderNumber: order.orderNumber,
      customerName: order.customerName || customerName || "Customer",
      customerEmail: order.customerEmail || customerEmail,
      items: (order.items as any[]).map((i: any) => ({ productName: i.productName, quantity: i.quantity, price: i.price, image: i.image })),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      shippingMethod: order.shippingMethod || "",
      shippingAddress: order.shippingAddress || "",
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Paystack verification error:", error)
    return NextResponse.json({ success: false, message: "Verification error" }, { status: 500 })
  }
}


