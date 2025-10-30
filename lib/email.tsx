import { Resend } from "resend"
import { render } from "@react-email/render"
import OrderConfirmationEmail from "./email-templates/order-confirmation"
import AdminOrderNotificationEmail from "./email-templates/admin-order-notification"  // New import

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(
  customerEmail: string,
  adminEmail: string,
  orderData: {
    orderNumber: string
    customerName: string
    customerEmail?: string
    items: Array<{ productName: string; quantity: number; price: number; image: string }>  // Updated to match single string
    subtotal?: number
    shippingCost?: number
    total: number
    shippingMethod?: string
    shippingAddress?: string
    customerPhone?: string  // Optional: For admin email
  },
) {
  // Customer email: Confirmation with support link to admin
  const customerHtml = render(
    OrderConfirmationEmail({
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail || customerEmail,
      items: orderData.items.map((i) => ({
        name: i.productName,
        quantity: i.quantity,
        price: i.price,
        image: i.image || "",  // Single string; empty fallback
      })),
      subtotal: orderData.subtotal ?? Math.max(0, orderData.total - (orderData.shippingCost || 0)),
      shipping: orderData.shippingCost || 0,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress || "",
      supportEmail: adminEmail,  // Pass adminEmail for the support link
    })
  )

  // Admin email: Separate notification template
  const adminHtml = render(
    AdminOrderNotificationEmail({
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail || customerEmail,
      // customerPhone: orderData.customerPhone || "",  // From order
      items: orderData.items.map((i) => ({
        name: i.productName,
        quantity: i.quantity,
        price: i.price,
        image: i.image || "",
      })),
      subtotal: orderData.subtotal ?? Math.max(0, orderData.total - (orderData.shippingCost || 0)),
      shipping: orderData.shippingCost || 0,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress || "",
      shippingMethod: orderData.shippingMethod || "",
    })
  )

  // Send to customer
  await resend.emails.send({
    from: "METAHAIR <orders@metahair.store>",
    to: customerEmail,
    subject: `Order Confirmation - ${orderData.orderNumber}`,
    html: await customerHtml,
  }) as any

  // Send to admin
  await resend.emails.send({
    from: "NEW HAIR ORDER <orders@metahair.store>",
    to: adminEmail,
    subject: `New Order Alert - ${orderData.orderNumber}`,
    html: await adminHtml,
  }) as any
}