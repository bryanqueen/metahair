import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(
  customerEmail: string,
  adminEmail: string,
  orderData: {
    orderNumber: string
    customerName: string
    items: Array<{ productName: string; quantity: number; price: number }>
    total: number
    shippingMethod: string
  },
) {
  // Send to customer
  await resend.emails.send({
    from: "orders@metahair.com",
    to: customerEmail,
    subject: `Order Confirmation - ${orderData.orderNumber}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Order Number: ${orderData.orderNumber}</p>
      <h3>Order Summary:</h3>
      <ul>
        ${orderData.items.map((item) => `<li>${item.productName} x${item.quantity} - ₦${item.price}</li>`).join("")}
      </ul>
      <p><strong>Total: ₦${orderData.total}</strong></p>
      <p>Shipping Method: ${orderData.shippingMethod}</p>
    `,
  })

  // Send to admin
  await resend.emails.send({
    from: "orders@metahair.com",
    to: adminEmail,
    subject: `New Order - ${orderData.orderNumber}`,
    html: `
      <h2>New Order Received</h2>
      <p>Customer: ${orderData.customerName}</p>
      <p>Email: ${customerEmail}</p>
      <p>Order Number: ${orderData.orderNumber}</p>
      <h3>Order Summary:</h3>
      <ul>
        ${orderData.items.map((item) => `<li>${item.productName} x${item.quantity} - ₦${item.price}</li>`).join("")}
      </ul>
      <p><strong>Total: ₦${orderData.total}</strong></p>
      <p>Shipping Method: ${orderData.shippingMethod}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard">View Order in Dashboard</a></p>
    `,
  })
}
