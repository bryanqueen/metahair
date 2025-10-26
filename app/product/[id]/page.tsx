"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Minus, Plus, MessageCircle, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"

interface Product {
  _id: string
  name: string
  price: number
  category: {
    _id: string
    name: string
    image: string
  }
  description: string
  images: string[]
  stock: number
  featured: boolean
  createdAt: string
}

// Data will be fetched from API

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState("")
  const [flyingCart, setFlyingCart] = useState<{ x: number; y: number } | null>(null)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        
        // Fetch product details
        const productResponse = await fetch(`/api/products/${params.id}`)
        if (productResponse.ok) {
          const productData = await productResponse.json()
          setProduct(productData)
          
          // Fetch related products from same category
          const relatedResponse = await fetch(`/api/products?category=${productData.category._id}&limit=4`)
          const relatedData = await relatedResponse.json()
          setRelatedProducts(relatedData.products?.filter((p: Product) => p._id !== productData._id) || [])
        } else {
          setProduct(null)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

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

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-8 py-20 text-center">
          <h1 className="font-serif text-4xl mb-4">Product Not Found</h1>
          <Link href="/shop">
            <Button className="bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans">
              Continue Shopping
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleQuantityChange = (newQuantity: number) => {
    setError("")
    if (newQuantity < 1) {
      setError("Quantity must be at least 1")
      return
    }
    if (newQuantity > product.stock) {
      setError(`Only ${product.stock} items available in stock`)
      return
    }
    setQuantity(newQuantity)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    if (quantity > product.stock) {
      setError(`Only ${product.stock} items available in stock`)
      return
    }

    const button = e.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()

    setFlyingCart({ x: rect.left, y: rect.top })

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || "/placeholder.svg",
    })

    setTimeout(() => setFlyingCart(null), 600)
    setQuantity(1)
  }

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${product.name} (₦${product.price.toLocaleString()}). Can you provide more details?`,
  )

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
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
        {/* Breadcrumb */}
        <div className="mb-8 hidden md:flex items-center gap-2 text-sm font-sans text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black">
            Shop
          </Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category._id}`} className="hover:text-black">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-20">
          {/* Image Gallery */}
          <div>
            <div 
              className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden md:rounded-lg"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
                    }
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white transition-colors rounded-full"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white transition-colors rounded-full"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Mobile Swipe Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                    {product.images.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 transition-all rounded-full ${
                          index === currentImageIndex ? "bg-white w-6" : "bg-white/50 w-1.5"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Desktop Thumbnail Images - Removed for cleaner look */}
            {product.images.length > 1 && (
              <div className="hidden md:grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-gray-100 overflow-hidden rounded-md ${
                      index === currentImageIndex ? "ring-2 ring-black" : ""
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-sans mb-2">{product.category.name}</p>
            <h1 className="font-serif text-3xl md:text-4xl mb-4">{product.name}</h1>
            <p className="font-sans text-2xl md:text-3xl mb-6">₦{product.price.toLocaleString()}</p>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <p className="font-sans text-sm md:text-base text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Info */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="font-sans text-sm text-gray-600">
                  <span className="text-green-600 font-medium">In Stock</span> - {product.stock} available
                </p>
              ) : (
                <p className="font-sans text-sm text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block font-sans text-sm mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-16 text-center font-sans outline-none"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {error && <p className="text-red-600 text-sm font-sans">{error}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-black text-white hover:bg-[#D4A574] hover:text-black transition-colors font-sans py-6 text-base md:text-lg"
              >
                Add to Cart
              </Button>

              <a
                href={`https://wa.me/1234567890?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors font-sans py-6 text-base md:text-lg flex items-center justify-center gap-2 bg-transparent"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Contact Seller
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl md:text-3xl mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct._id} href={`/product/${relatedProduct._id}`} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={relatedProduct.images[0] || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-sans">
                      {relatedProduct.category.name}
                    </p>
                    <h3 className="font-serif text-base md:text-lg">{relatedProduct.name}</h3>
                    <p className="font-sans text-sm md:text-base">₦{relatedProduct.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  )
}
