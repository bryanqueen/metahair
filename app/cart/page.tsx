"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useState, useEffect } from "react"

interface ShippingMethod {
  _id: string
  name: string
  price: number
  description?: string
  estimatedDays?: number
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem } = useCart()
  const [loading, setLoading] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  // Don't show full-page loader - show page immediately

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {loading && null}
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-serif text-3xl md:text-5xl mb-2 md:mb-4">Shopping Cart</h1>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-200 pb-6">
                    <div className="w-24 h-32 flex-shrink-0 bg-gray-100 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg mb-2">{item.name}</h3>
                      <p className="font-sans text-lg mb-4">₦{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 font-sans">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping selection moved to Checkout */}
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
                  <div className="flex justify-between font-sans text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                <div className="flex justify-between font-serif text-lg mb-6">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 md:py-20">
            <p className="text-gray-500 font-sans text-lg mb-6">Your cart is empty</p>
            <Link href="/shop">
              <Button className="bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
