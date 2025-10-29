"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: any) => {
        openIframe: () => void
      }
    }
  }
}

interface ShippingMethod {
  _id: string
  name: string
  price: number
  description?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, clearCart } = useCart()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState("")
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await fetch('/api/shippping-methods')
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setShippingMethods(data)
          const saved = typeof window !== 'undefined' ? localStorage.getItem('selected_shipping_method') : null
          setSelectedShipping(saved || data[0]._id)
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error)
      }
    }
    fetchShippingMethods()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaystackPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotice(null)
    if (!window.PaystackPop) {
      setNotice({ type: 'error', message: 'Paystack is not loaded. Please check your internet connection.' })
      return
    }

    setIsProcessing(true)

    try {
      // Build order payload
      const orderPayload = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        items: cartItems.map((i) => ({ productId: i.id, productName: i.name, quantity: i.quantity, price: i.price })),
        shippingMethod: shippingMethods.find((m) => m._id === selectedShipping)?.name || '',
        shippingCost: shippingMethods.find((m) => m._id === selectedShipping)?.price || 0,
        subtotal,
        total,
      }

      // Create pending order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const order = await orderResponse.json()
      
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
      if (!publicKey) {
        setNotice({ type: 'error', message: 'Paystack key not configured.' })
        return
      }

      const amountInKobo = Math.round(total * 100)

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: formData.email,
        amount: amountInKobo,
        currency: 'NGN',
        ref: `METAHAIR_${Date.now()}`,
        metadata: {
          orderId: order._id,
          customer_name: `${formData.firstName} ${formData.lastName}`,
        },
        callback: function(response: any) {
          (async () => {
            try {
              const verifyRes = await fetch('/api/paystack/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference: response.reference, orderId: order._id, customerEmail: formData.email, customerName: `${formData.firstName} ${formData.lastName}` })
              })
              if (verifyRes.ok) {
                clearCart()
                const verified = await verifyRes.json()
                const oid = verified?.order?._id || order._id
                router.push(`/checkout/success?orderId=${oid}`)
              } else {
                setNotice({ type: 'error', message: 'Payment verification failed. Please contact support.' })
              }
            } catch (err) {
              setNotice({ type: 'error', message: 'Payment verification error.' })
            }
          })()
        },
        onClose: function() {
          setNotice({ type: 'info', message: 'Payment window closed.' })
        },
      })

      handler.openIframe()
    } catch (error) {
      console.error('Payment error:', error)
      setNotice({ type: 'error', message: 'Something went wrong. Please try again.' })
    } finally {
      setIsProcessing(false)
    }
  }

  // Add Paystack script to document
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingPrice = shippingMethods.find((m) => m._id === selectedShipping)?.price || 0
  const shipping = subtotal > 0 ? shippingPrice : 0
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-serif text-3xl md:text-5xl mb-2 md:mb-4">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePaystackPayment} className="space-y-8">
              {/* Shipping Information */}
              <div>
                <h2 className="font-serif text-2xl mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-200 font-sans text-sm"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-200 font-sans text-sm"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-200 font-sans text-sm md:col-span-2"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-200 font-sans text-sm md:col-span-2"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-200 font-sans text-sm md:col-span-2"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-200 font-sans text-sm"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-200 font-sans text-sm"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-200 font-sans text-sm"
                  />
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl mb-6">Shipping Method</h2>
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label
                      key={method._id}
                      className="flex items-center gap-3 p-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method._id}
                        checked={selectedShipping === method._id}
                        onChange={(e) => {
                          setSelectedShipping(e.target.value)
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('selected_shipping_method', e.target.value)
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-sans font-medium">{method.name}</p>
                        {method.description && (
                          <p className="font-sans text-sm text-gray-600">{method.description}</p>
                        )}
                      </div>
                      <p className="font-sans font-semibold">₦{method.price.toLocaleString()}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment via Paystack */}
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h3 className="font-serif text-lg mb-2">Payment Method</h3>
                <p className="font-sans text-sm text-gray-600 mb-4">
                  You will be redirected to Paystack to complete your payment securely.
                </p>
                <p className="font-sans text-xs text-gray-500">
                  Payment is processed securely by Paystack. We do not store your card information.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans py-3 text-base"
              >
                {isProcessing ? "Processing..." : "Complete Purchase with Paystack"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 p-6 sticky top-24">
              <h2 className="font-serif text-xl mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                <div className="flex justify-between font-sans">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span>Shipping</span>
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between font-serif text-lg">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notice && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded shadow ${notice.type === 'success' ? 'bg-green-600 text-white' : notice.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'}`}>
          <span className="font-sans text-sm">{notice.message}</span>
        </div>
      )}

      <Footer />
    </div>
  )
}
