"use client"

import { useState, useEffect } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

interface Category {
  _id: string
  name: string
  image: string
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden"
      fetchCategories()
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 animate-slide-in-left">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="font-serif text-xl">Menu</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Menu Items */}
      <div className="p-6 space-y-6">
        <a href="/new-arrivals" className="block text-lg font-sans hover:text-[#D4A574] transition-colors">
          New Arrivals
        </a>

        {/* Categories Accordion */}
        <div>
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="w-full flex items-center justify-between text-lg font-sans hover:text-[#D4A574] transition-colors"
          >
            Categories
            {isCategoriesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {isCategoriesOpen && (
            <div className="mt-4 ml-4 space-y-3 animate-slide-down">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D4A574] mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading categories...</p>
                </div>
              ) : (
                categories.map((category) => (
                  <a
                    key={category._id}
                    href={`/shop?category=${category._id}`}
                    className="block text-base font-sans text-gray-600 hover:text-[#D4A574] transition-colors"
                    onClick={onClose}
                  >
                    {category.name}
                  </a>
                ))
              )}
            </div>
          )}
        </div>

        <a href="/shop" className="block text-lg font-sans hover:text-[#D4A574] transition-colors">
          Shop
        </a>

        <a href="/faqs" className="block text-lg font-sans hover:text-[#D4A574] transition-colors">
          FAQs
        </a>
      </div>
    </div>
  )
}
