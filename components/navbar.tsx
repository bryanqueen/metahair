"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingBag, Menu, ChevronDown } from "lucide-react"
import { SearchModal } from "./search-modal"
import { MobileMenu } from "./mobile-menu"
import { CartCounter } from "./cart-counter"

interface Category {
  _id: string
  name: string
  image: string
}

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        if (Array.isArray(data)) {
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (showCategoryDropdown && categories.length > 0) {
      const interval = setInterval(() => {
        setCurrentCategoryIndex((prev) => (prev + 1) % categories.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [showCategoryDropdown, categories])

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Top Layer */}
        <div className="px-8 py-4 border-b border-gray-100 bg-black">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Search Icon - Left */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:border transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-white" />
            </button>

            {/* Logo - Center */}
            <Link href="/" className="flex-1 flex justify-center">
              <Image src="/metahair_logo_2.png" alt="METAHAIR" width={180} height={60} className="h-12 w-auto" />
            </Link>

            {/* Cart Icon - Right */}
            <Link href="/cart" className="p-2 hover:border transition-colors relative" aria-label="Shopping cart">
              <ShoppingBag className="w-5 h-5 text-white" />
              <CartCounter />
            </Link>
          </div>
        </div>

        {/* Bottom Layer - Menu Items */}
        <div className="px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-12">
            <Link href="/new-arrivals" className="text-sm font-sans hover:text-[#D4A574] transition-colors">
              New Arrivals
            </Link>

            {/* Categories with Dropdown */}
            <div className="relative">
              <button 
                className="text-sm font-sans hover:text-[#D4A574] transition-colors flex items-center gap-1"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                onMouseEnter={() => setShowCategoryDropdown(true)}
                onMouseLeave={() => setShowCategoryDropdown(false)}
              >
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>

              {showCategoryDropdown && categories.length > 0 && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white border border-gray-200 shadow-lg w-[600px] p-6 animate-slide-down"
                  onMouseEnter={() => setShowCategoryDropdown(true)}
                  onMouseLeave={() => setShowCategoryDropdown(false)}
                >
                  {/* Story-style loader */}
                  <div className="flex gap-1 mb-6">
                    {categories.map((_, index) => (
                      <div key={index} className="flex-1 h-0.5 bg-gray-200 overflow-hidden">
                        {index === currentCategoryIndex && <div className="h-full bg-[#D4A574] story-loader" />}
                        {index < currentCategoryIndex && <div className="h-full bg-[#D4A574] w-full" />}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-8">
                    {/* Categories List */}
                    <div className="w-40 flex flex-col gap-3">
                      {categories.map((category, index) => (
                        <Link
                          key={category._id}
                          href={`/shop?category=${category._id}`}
                          onClick={() => setShowCategoryDropdown(false)}
                          className={`text-sm font-sans transition-colors py-2 px-3 ${
                            index === currentCategoryIndex
                              ? "text-[#D4A574] font-semibold"
                              : "text-gray-700 hover:text-[#D4A574]"
                          }`}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>

                    {/* Image Canvas */}
                    <div className="flex-1 overflow-hidden bg-gray-100">
                      <img
                        src={categories[currentCategoryIndex]?.image || "/placeholder.svg"}
                        alt={categories[currentCategoryIndex]?.name}
                        className="w-full object-cover transition-opacity duration-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/shop" className="text-sm font-sans hover:text-[#D4A574] transition-colors">
              Shop
            </Link>
            <Link href="/faqs" className="text-sm font-sans hover:text-[#D4A574] transition-colors">
              FAQs
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-black sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Menu Icon - Left */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:border transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>

            {/* Logo - Center */}
            <Link href="/">
              <Image src="/metahair_logo_2.png" alt="METAHAIR" width={140} height={50} className="h-10 w-auto" />
            </Link>

            {/* Search and Cart Icons - Right */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:border transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
              <Link href="/cart" className="p-2 hover:border transition-colors relative" aria-label="Shopping cart">
                <ShoppingBag className="w-5 h-5 text-white" />
                <CartCounter />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
