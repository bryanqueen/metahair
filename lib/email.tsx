import { Resend } from "resend"
import { render } from "@react-email/render"
import OrderConfirmationEmail from "./email-templates/order-confirmation"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(
  customerEmail: string,
  adminEmail: string,
  orderData: {
    orderNumber: string
    customerName: string
    customerEmail?: string
    items: Array<{ productName: string; quantity: number; price: number; image?: string }>
    subtotal?: number
    shippingCost?: number
    total: number
    shippingMethod?: string
    shippingAddress?: string
  },
) {
  const emailHtml = render(
    OrderConfirmationEmail({
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail || customerEmail,
      items: orderData.items.map((i) => ({
        name: i.productName,
        quantity: i.quantity,
        price: i.price,
        image: i.image || `${process.env.NEXT_PUBLIC_APP_URL}/metahair_logo_2.png`
      })),
      subtotal: orderData.subtotal ?? Math.max(0, orderData.total - (orderData.shippingCost || 0)),
      shipping: orderData.shippingCost || 0,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress || "",
    })
  )

  await resend.emails.send({
    from: "orders@metahair.store",
    to: customerEmail,
    subject: `Order Confirmation - ${orderData.orderNumber}`,
    html: await emailHtml,
  }) as any

  await resend.emails.send({
    from: "orders@metahair.store",
    to: adminEmail,
    subject: `New Order - ${orderData.orderNumber}`,
    html: await emailHtml,
  }) as any
}
