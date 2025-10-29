"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return
      try {
        setLoading(true)
        const res = await fetch(`/api/orders/${orderId}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  // Confetti removed per request

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-16 text-center">
        <h1 className="font-serif text-3xl md:text-5xl mb-3">Order successfully placed</h1>
        <p className="text-gray-600 font-sans mb-8">Thank you for shopping with METAHAIR.</p>
        {loading ? (
          <div className="py-10">Loading order...</div>
        ) : order ? (
          <div className="border border-gray-200 rounded-lg p-6 text-left mx-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="font-sans text-sm text-gray-600">Order No.</p>
              <p className="font-sans font-semibold">{order.orderNumber}</p>
            </div>
            <div className="space-y-3 mb-6">
              {order.items.map((it: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="font-sans">{it.productName} × {it.quantity}</span>
                  <span className="font-sans">₦{(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-sans">Subtotal</span>
                <span className="font-sans">₦{order.subtotal?.toLocaleString?.() || '-'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-sans">Shipping</span>
                <span className="font-sans">₦{order.shippingCost?.toLocaleString?.() || '0'}</span>
              </div>
              <div className="flex items-center justify-between text-base font-serif">
                <span>Total</span>
                <span>₦{order.total?.toLocaleString?.()}</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8">
          <Button onClick={() => router.push('/shop')} className="bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans">Continue Shopping</Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}


