"use client"

import { useState, useEffect } from "react"
import { X, Search } from "lucide-react"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  category: {
    _id: string
    name: string
  }
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products?limit=50')
        const data = await response.json()
        setAllProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([])
    } else {
      const filtered = allProducts.filter((product) => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery, allProducts])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
      setSearchQuery("")
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white w-full max-w-5xl animate-slide-down max-h-[80vh] overflow-y-auto">
        {/* Search Header */}
        <div className="border-b border-gray-200 p-6 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for wigs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-lg outline-none font-sans"
              autoFocus
            />
            <button onClick={onClose} className="p-2 hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
              <p className="text-gray-500 font-sans">Loading products...</p>
            </div>
          ) : searchQuery.trim() === "" ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-sans">Start typing to search for products</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {filteredProducts.slice(0, 8).map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="group cursor-pointer"
                    onClick={onClose}
                  >
                    <div className="aspect-[3/4] bg-gray-100 mb-2 overflow-hidden">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-serif text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm font-sans">₦{product.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>

              {filteredProducts.length > 8 && (
                <div className="text-center pt-4 border-t border-gray-200">
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    className="text-sm font-sans hover:text-[#D4A574] transition-colors underline"
                    onClick={onClose}
                  >
                    View all {filteredProducts.length} results
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 font-sans">No products found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
