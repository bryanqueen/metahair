"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ProductGridSkeleton } from "@/components/ui/product-skeleton"
import { ChevronDown, SlidersHorizontal, ShoppingCart } from "lucide-react"
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
  images: string[]
  stock: number
  featured: boolean
  createdAt: string
}

interface Category {
  _id: string
  name: string
  image: string
  description?: string
}

// Data will be fetched from APIs

const ITEMS_PER_PAGE = 4

function ShopContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [flyingCart, setFlyingCart] = useState<{ id: string; x: number; y: number } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)

        // Fetch products
        const productsResponse = await fetch(`/api/products?page=${currentPage}&limit=${ITEMS_PER_PAGE}${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`)
        const productsData = await productsResponse.json()
        setProducts(productsData.products || [])
        setTotalPages(productsData.pages || 1)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    const button = e.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()

    setFlyingCart({ id: product._id, x: rect.left, y: rect.top })

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || "/placeholder.svg",
    })

    setTimeout(() => setFlyingCart(null), 600)
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
        <div className="sticky top-20 md:top-32 bg-white z-40 pb-4 md:pb-6 mb-6 md:mb-8">
          <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl mb-2 md:mb-3">Shop All Wigs</h1>
          <p className="text-gray-600 font-sans text-xs md:text-sm">
            Showing {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full flex items-center justify-between p-4 border border-gray-200 mb-4"
            >
              <span className="font-sans flex items-center gap-2 text-sm">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            <div className={`space-y-6 md:space-y-8 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div>
                <h3 className="font-serif text-base md:text-lg mb-3 md:mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`block w-full text-left px-3 md:px-4 py-2 font-sans text-xs md:text-sm transition-colors ${
                      selectedCategory === "all" ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedCategory(category._id)}
                      className={`block w-full text-left px-3 md:px-4 py-2 font-sans text-xs md:text-sm transition-colors ${
                        selectedCategory === category._id ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
                <ProductGridSkeleton count={6} />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
                  {products.map((product) => (
                    <div key={product._id} className="group cursor-pointer">
                      <Link href={`/product/${product._id}`}>
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3 md:mb-4">
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.stock < 10 && (
                            <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#D4A574] text-black px-2 md:px-3 py-1 text-xs font-sans">
                              Only {product.stock} left
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-sans">{product.category.name}</p>
                          <h3 className="font-serif text-base md:text-lg">{product.name}</h3>
                          <p className="font-sans text-sm md:text-base">₦{product.price.toLocaleString()}</p>
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="font-sans text-xs md:text-sm"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        className={`font-sans text-xs md:text-sm ${currentPage === page ? "bg-black text-white" : ""}`}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="font-sans text-xs md:text-sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 md:py-20">
                <p className="text-gray-500 font-sans text-base md:text-lg">No products found matching your filters.</p>
                <Button
                  onClick={() => setSelectedCategory("all")}
                  className="mt-4 md:mt-6 bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans text-sm"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}
