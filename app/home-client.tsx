"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
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

interface Collection {
  _id: string
  name: string
  image: string
  productCount: number
}

const heroImages = [
  "/metamodel3.jpeg",
  "/metamodel4.jpeg",
  "/meta-model1.jpeg",
  "/metamodel2.jpeg",
]

interface HomeClientProps {
  newArrivalsProducts: Product[]
  featuredProducts: Product[]
  collections: Collection[]
}

export function HomeClient({ newArrivalsProducts, featuredProducts, collections }: HomeClientProps) {
  const [currentHeroImage, setCurrentHeroImage] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [featuredCarouselIndex, setFeaturedCarouselIndex] = useState(0)
  const [flyingCart, setFlyingCart] = useState<{ id: string; x: number; y: number } | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Update hero image display
  useEffect(() => {
    const heroImages = document.querySelectorAll('[data-hero-image]')
    const indicators = document.querySelectorAll('[data-hero-indicator]')
    
    heroImages.forEach((img, i) => {
      if (i === currentHeroImage) {
        (img as HTMLElement).style.opacity = '1'
      } else {
        (img as HTMLElement).style.opacity = '0'
      }
    })

    indicators.forEach((indicator, i) => {
      if (i === currentHeroImage) {
        indicator.classList.add('w-8')
        indicator.classList.remove('bg-white/50')
        indicator.classList.add('bg-white')
      } else {
        indicator.classList.remove('w-8')
        indicator.classList.add('bg-white/50')
        indicator.classList.remove('bg-white')
      }
    })
  }, [currentHeroImage])

  const itemsPerPage = typeof window !== "undefined" && window.innerWidth < 768 ? 2 : 4
  const maxCarouselIndex = Math.ceil(newArrivalsProducts.length / itemsPerPage) - 1
  const maxFeaturedCarouselIndex = Math.ceil(featuredProducts.length / itemsPerPage) - 1

  const handleCarouselNext = () => {
    setCarouselIndex((prev) => (prev + 1) % (maxCarouselIndex + 1))
  }

  const handleCarouselPrev = () => {
    setCarouselIndex((prev) => (prev - 1 + (maxCarouselIndex + 1)) % (maxCarouselIndex + 1))
  }

  const handleFeaturedCarouselNext = () => {
    setFeaturedCarouselIndex((prev) => (prev + 1) % (maxFeaturedCarouselIndex + 1))
  }

  const handleFeaturedCarouselPrev = () => {
    setFeaturedCarouselIndex((prev) => (prev - 1 + (maxFeaturedCarouselIndex + 1)) % (maxFeaturedCarouselIndex + 1))
  }

  const visibleNewArrivals = newArrivalsProducts.slice(carouselIndex * itemsPerPage, (carouselIndex + 1) * itemsPerPage)
  const visibleFeaturedProducts = featuredProducts.slice(featuredCarouselIndex * itemsPerPage, (featuredCarouselIndex + 1) * itemsPerPage)

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

  return (
    <>
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

      {/* New Arrivals Section */}
      <section className="px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-12 gap-4">
            <h2 className="font-serif text-xl md:text-3xl text-balance">New Arrivals</h2>
            <Link href="/new-arrivals">
              <Button
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white font-sans bg-transparent text-xs md:text-sm px-4 md:px-6"
              >
                View All
              </Button>
            </Link>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-4 gap-8">
            {visibleNewArrivals.map((product) => (
              <div key={product._id} className="group cursor-pointer">
                <Link href={`/product/${product._id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-sans">{product.category.name}</p>
                    <h3 className="font-serif text-lg">{product.name}</h3>
                    {product.isOnSale ? (
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-base font-semibold">₦{effectivePrice(product).toLocaleString()}</span>
                        <span className="font-sans text-sm text-gray-500 line-through">₦{product.price.toLocaleString()}</span>
                        {product.discountPercent ? (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5">-{product.discountPercent}%</span>
                        ) : null}
                      </div>
                    ) : (
                      <p className="font-sans text-base">₦{product.price.toLocaleString()}</p>
                    )}
                  </div>
                </Link>
                <Button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full bg-black text-white hover:bg-[#D4A574] hover:text-black transition-colors font-sans text-sm mt-2"
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {visibleNewArrivals.map((product) => (
                <div key={product._id} className="group cursor-pointer">
                  <Link href={`/product/${product._id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-white mb-3">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-sans">{product.category.name}</p>
                      <h3 className="font-serif text-sm">{product.name}</h3>
                      {product.isOnSale ? (
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-sm font-semibold">₦{effectivePrice(product).toLocaleString()}</span>
                          <span className="font-sans text-xs text-gray-500 line-through">₦{product.price.toLocaleString()}</span>
                        </div>
                      ) : (
                        <p className="font-sans text-sm">₦{product.price.toLocaleString()}</p>
                      )}
                    </div>
                  </Link>
                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-black text-white hover:bg-[#D4A574] hover:text-black transition-colors font-sans text-xs py-2 mt-2"
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleCarouselPrev}
                className="p-2 border border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: maxCarouselIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === carouselIndex ? "bg-black w-6" : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={handleCarouselNext}
                className="p-2 border border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section - Masonry Layout */}
      <section className="px-4 md:px-8 py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl md:text-4xl text-center mb-8 md:mb-16 text-balance">Our Collections</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[280px]">
            {collections.map((collection, index) => (
              <Link
                key={collection._id}
                href={`/shop?category=${collection._id}`}
                className={`group cursor-pointer overflow-hidden ${index === 0 ? "md:row-span-2" : ""}`}
              >
                <div className="relative h-full">
                  <img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 md:p-8">
                    <h3
                      className={`font-serif text-white mb-1 md:mb-2 ${index === 0 ? "text-2xl md:text-3xl" : "text-lg md:text-2xl"}`}
                    >
                      {collection.name}
                    </h3>
                    <p className="text-white/80 font-sans text-xs md:text-sm">{collection.productCount} Products</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="px-4 md:px-8 py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-12 gap-4">
            <h2 className="font-serif text-xl md:text-3xl text-balance">Featured Products</h2>
            <Link href="/shop?featured=true">
              <Button
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white font-sans bg-transparent text-xs md:text-sm px-4 md:px-6"
              >
                View All
              </Button>
            </Link>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-4 gap-8">
            {visibleFeaturedProducts.map((product) => (
              <div key={product._id} className="group cursor-pointer">
                <Link href={`/product/${product._id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#D4A574] text-black px-2 py-1 text-xs font-sans">
                      FEATURED
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-sans">{product.category.name}</p>
                    <h3 className="font-serif text-lg">{product.name}</h3>
                    {product.isOnSale ? (
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-base font-semibold">₦{effectivePrice(product).toLocaleString()}</span>
                        <span className="font-sans text-sm text-gray-500 line-through">₦{product.price.toLocaleString()}</span>
                        {product.discountPercent ? (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5">-{product.discountPercent}%</span>
                        ) : null}
                      </div>
                    ) : (
                      <p className="font-sans text-base">₦{product.price.toLocaleString()}</p>
                    )}
                  </div>
                </Link>
                <Button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full bg-black text-white hover:bg-[#D4A574] hover:text-black transition-colors font-sans text-sm mt-2"
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {visibleFeaturedProducts.map((product) => (
                <div key={product._id} className="group cursor-pointer">
                  <Link href={`/product/${product._id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-white mb-3">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-[#D4A574] text-black px-2 py-0.5 text-xs font-sans">
                        FEATURED
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-sans">{product.category.name}</p>
                      <h3 className="font-serif text-sm">{product.name}</h3>
                      {product.isOnSale ? (
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-sm font-semibold">₦{effectivePrice(product).toLocaleString()}</span>
                          <span className="font-sans text-xs text-gray-500 line-through">₦{product.price.toLocaleString()}</span>
                        </div>
                      ) : (
                        <p className="font-sans text-sm">₦{product.price.toLocaleString()}</p>
                      )}
                    </div>
                  </Link>
                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-black text-white hover:bg-[#D4A574] hover:text-black transition-colors font-sans text-xs py-2 mt-2"
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleFeaturedCarouselPrev}
                className="p-2 border border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: maxFeaturedCarouselIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setFeaturedCarouselIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === featuredCarouselIndex ? "bg-black w-6" : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={handleFeaturedCarouselNext}
                className="p-2 border border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

