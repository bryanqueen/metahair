import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Hr,
    Row,
    Column,
  } from '@react-email/components'
  import * as React from 'react'
  
  interface AdminOrderNotificationEmailProps {
    orderNumber: string
    customerName: string
    customerEmail: string
    // customerPhone: string
    items: Array<{
      name: string
      quantity: number
      price: number
      image: string
    }>
    subtotal: number
    shipping: number
    total: number
    shippingAddress: string
    shippingMethod: string
  }
  
  export const AdminOrderNotificationEmail = ({
    orderNumber,
    customerName,
    customerEmail,
    // customerPhone,
    items,
    subtotal,
    shipping,
    total,
    shippingAddress,
    shippingMethod,
  }: AdminOrderNotificationEmailProps) => (
    <Html>
      <Head />
      <Preview>New METAHAIR Order #{orderNumber} - Action Required!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://metahair.vercel.app/metahair_logo_2.png"  // Your real logo
              width="200"
              height="80"
              alt="METAHAIR"
              style={logo}
            />
          </Section>
  
          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>New Order Alert!</Heading>
            <Text style={text}>
              A new order has been placed and paid for. Please process immediately.
            </Text>
  
            {/* Customer Details */}
            <Section style={orderDetails}>
              <Heading style={h2}>Customer Details</Heading>
              <Text style={text}><strong>Name:</strong> {customerName}</Text>
              <Text style={text}><strong>Email:</strong> {customerEmail}</Text>
              {/* <Text style={text}><strong>Phone:</strong> {customerPhone}</Text> */}
              <Text style={text}><strong>Order #:</strong> {orderNumber}</Text>
            </Section>
  
            {/* Order Details */}
            <Section style={orderDetails}>
              <Heading style={h2}>Order Items</Heading>
              
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemImage}>
                    {item.image && (
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
                    <Text style={summaryLabel}>Shipping ({shippingMethod}):</Text>
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
  
            {/* Action Steps */}
            <Section style={nextSteps}>
              <Heading style={h2}>Action Required</Heading>
              <Text style={text}>
                • Verify stock and prepare items (1-2 business days)<br />
                • Update order status in dashboard<br />
                • Ship and notify customer with tracking
              </Text>
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
          </Section>
        </Container>
      </Body>
    </Html>
  )
  
  // Styles
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
  
  export default AdminOrderNotificationEmail