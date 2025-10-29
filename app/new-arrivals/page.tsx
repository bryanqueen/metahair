"use client"

import type React from "react"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"

interface Product {
  _id: string
  name: string
  price: number
  isOnSale?: boolean
  discountPercent?: number
  salePrice?: number
  category: {
    _id: string
    name: string
    image: string
  }
  images: string[]
  stock: number
  featured: boolean
  createdAt: string
}

// Data will be fetched from API

export default function NewArrivalsPage() {
  const [flyingCart, setFlyingCart] = useState<{ id: string; x: number; y: number } | null>(null)
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products?limit=20&sort=createdAt')
        const data = await response.json()
        setNewArrivals(data.products || [])
      } catch (error) {
        console.error('Error fetching new arrivals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewArrivals()
  }, [])

  const effectivePrice = (p: Product) => {
    if (p?.isOnSale) {
      if (typeof p.salePrice === 'number' && p.salePrice > 0) return p.salePrice
      if (typeof p.discountPercent === 'number' && p.discountPercent > 0) {
        return Math.max(0, Math.round(p.price * (1 - p.discountPercent / 100)))
      }
    }
    return p.price
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    const button = e.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()

    setFlyingCart({ id: product._id, x: rect.left, y: rect.top })

    addToCart({
      id: product._id,
      name: product.name,
      price: effectivePrice(product),
      quantity: 1,
      image: product.images[0] || "/placeholder.svg",
    })

    setTimeout(() => setFlyingCart(null), 600)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
          <p className="font-sans text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Flying Cart Animation */}
      {flyingCart && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: `${flyingCart.x}px`,
            top: `${flyingCart.y}px`,
            animation: "flyToCart 0.6s ease-in forwards",
          }}
        >
          <ShoppingCart className="w-6 h-6 text-[#D4A574]" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-serif text-3xl md:text-5xl mb-2 md:mb-4">New Arrivals</h1>
          <p className="text-gray-600 font-sans text-sm md:text-base">Discover our latest luxury wig collections</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {newArrivals.map((product) => (
            <div key={product._id} className="group cursor-pointer">
              <Link href={`/product/${product._id}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3 md:mb-4">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#D4A574] text-black px-2 md:px-3 py-1 text-xs font-sans">
                    NEW
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-sans">{product.category.name}</p>
                  <h3 className="font-serif text-base md:text-lg">{product.name}</h3>
                  {product.isOnSale ? (
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm md:text-base font-semibold">₦{effectivePrice(product).toLocaleString()}</span>
                      <span className="font-sans text-xs md:text-sm text-gray-500 line-through">₦{product.price.toLocaleString()}</span>
                      {product.discountPercent ? (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5">-{product.discountPercent}%</span>
                      ) : null}
                    </div>
                  ) : (
                    <p className="font-sans text-sm md:text-base">₦{product.price.toLocaleString()}</p>
                  )}
                </div>
              </Link>
              <Button
                onClick={(e) => handleAddToCart(e, product)}
                className="w-full bg-black text-white hover:bg-[#D4A574] hover:text-black transition-colors font-sans text-xs md:text-sm py-2 mt-2"
              >
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
