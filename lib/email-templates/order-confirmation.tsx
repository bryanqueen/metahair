import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from '@react-email/components'
import * as React from 'react'

interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
    image: string  // Single string
  }>
  subtotal: number
  shipping: number
  total: number
  shippingAddress: string
  supportEmail?: string  // New prop
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  customerEmail,
  items,
  subtotal,
  shipping,
  total,
  shippingAddress,
  supportEmail = "support@metahair.com",  // Default fallback
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your METAHAIR order #{orderNumber} has been confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Img
            src="https://metahair.vercel.app/metahair_logo_2.png"  // Use your real logo URL
            width="200"
            height="80"
            alt="METAHAIR"
            style={logo}
          />
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={h1}>Order Confirmed!</Heading>
          <Text style={text}>
            Hi {customerName},
          </Text>
          <Text style={text}>
            Thank you for your order! We're excited to prepare your luxury wigs for you. 
            Your order #{orderNumber} has been confirmed and is being processed.
          </Text>

          {/* Order Details */}
          <Section style={orderDetails}>
            <Heading style={h2}>Order Details</Heading>
            
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemImage}>
                  {item.image && (  // Only render if image exists
                    <Img
                      src={item.image}
                      width="80"
                      height="80"
                      alt={item.name}
                      style={productImage}
                    />
                  )}
                </Column>
                <Column style={itemDetails}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemQuantity}>Quantity: {item.quantity}</Text>
                  <Text style={itemPrice}>₦{item.price.toLocaleString()}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={divider} />

            {/* Order Summary */}
            <Section style={summary}>
              <Row style={summaryRow}>
                <Column>
                  <Text style={summaryLabel}>Subtotal:</Text>
                </Column>
                <Column style={summaryValue}>
                  <Text style={summaryText}>₦{subtotal.toLocaleString()}</Text>
                </Column>
              </Row>
              <Row style={summaryRow}>
                <Column>
                  <Text style={summaryLabel}>Shipping:</Text>
                </Column>
                <Column style={summaryValue}>
                  <Text style={summaryText}>₦{shipping.toLocaleString()}</Text>
                </Column>
              </Row>
              <Hr style={divider} />
              <Row style={summaryRow}>
                <Column>
                  <Text style={totalLabel}>Total:</Text>
                </Column>
                <Column style={summaryValue}>
                  <Text style={totalText}>₦{total.toLocaleString()}</Text>
                </Column>
              </Row>
            </Section>

            {/* Shipping Address */}
            <Section style={addressSection}>
              <Heading style={h3}>Shipping Address</Heading>
              <Text style={addressText}>{shippingAddress}</Text>
            </Section>
          </Section>

          {/* Next Steps */}
          <Section style={nextSteps}>
            <Heading style={h2}>What's Next?</Heading>
            <Text style={text}>
              • We'll prepare your order within 1-2 business days<br />
              • You'll receive a tracking number once your order ships<br />
              • Expected delivery: 3-7 business days
            </Text>
          </Section>

          {/* Contact Info */}
          <Section style={contactSection}>
            <Text style={text}>
              Questions about your order? Contact us at{' '}
              <Link href={`mailto:${supportEmail}`} style={link}>
                {supportEmail}
              </Link>
            </Text>
          </Section>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} METAHAIR. All rights reserved.
          </Text>
          <Text style={footerText}>
            Slay Beyond Limit
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

// Styles (unchanged from your original)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const header = {
  padding: '32px 24px',
  backgroundColor: '#000000',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
}

const content = {
  padding: '24px',
}

const h1 = {
  color: '#000000',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  fontFamily: 'serif',
}

const h2 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '32px 0 16px',
  padding: '0',
  fontFamily: 'serif',
}

const h3 = {
  color: '#000000',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 12px',
  padding: '0',
  fontFamily: 'serif',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const link = {
  color: '#D4A574',
  textDecoration: 'underline',
}

const orderDetails = {
  backgroundColor: '#f9fafb',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
}

const itemRow = {
  marginBottom: '16px',
  paddingBottom: '16px',
  borderBottom: '1px solid #e5e7eb',
}

const itemImage = {
  width: '80px',
  paddingRight: '16px',
}

const itemDetails = {
  verticalAlign: 'top' as const,
}

const productImage = {
  borderRadius: '4px',
  objectFit: 'cover' as const,
}

const itemName = {
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 4px',
}

const itemQuantity = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 4px',
}

const itemPrice = {
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
}

const divider = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
}

const summary = {
  marginTop: '24px',
}

const summaryRow = {
  marginBottom: '8px',
}

const summaryLabel = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
}

const summaryValue = {
  textAlign: 'right' as const,
}

const summaryText = {
  color: '#000000',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
}

const totalLabel = {
  color: '#000000',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
}

const totalText = {
  color: '#D4A574',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
}

const addressSection = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  margin: '24px 0',
}

const addressText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-line' as const,
}

const nextSteps = {
  backgroundColor: '#fef3c7',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
  border: '1px solid #f59e0b',
}

const contactSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const footer = {
  backgroundColor: '#000000',
  padding: '24px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0 0 8px',
}

export default OrderConfirmationEmail