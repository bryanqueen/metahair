"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { Modal } from "@/components/ui/modal"
import { ArrowLeft, Plus, Edit2, Trash2, Eye } from "lucide-react"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  price: number
  category: {
    _id: string
    name: string
  }
  images: string[]
  stock: number
  featured: boolean
  description: string
  createdAt: string
}

interface Category {
  _id: string
  name: string
  image: string
}

// Pre-made product descriptions
const PRODUCT_DESCRIPTIONS = [
  {
    id: "luxury",
    title: "Luxury Collection",
    description: "Experience the pinnacle of luxury with our premium collection. Crafted from the finest human hair with meticulous attention to detail, this piece embodies elegance and sophistication. Features natural texture, superior quality construction, and a flawless finish that will make you feel confident and beautiful."
  },
  {
    id: "premium",
    title: "Premium Quality",
    description: "Indulge in premium quality that exceeds expectations. Made with 100% human hair and advanced construction techniques, this piece offers natural movement, incredible durability, and a stunning appearance. Perfect for special occasions or everyday elegance, it's designed to make you look and feel your absolute best."
  },
  {
    id: "exclusive",
    title: "Exclusive Design",
    description: "Discover our exclusive design that combines timeless beauty with modern sophistication. Each piece is carefully crafted to provide exceptional comfort, natural styling versatility, and a look that's uniquely yours. This premium piece represents the perfect blend of quality, style, and luxury that METAHAIR is known for."
  }
]

export default function AdminProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedDescription, setSelectedDescription] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    images: [] as string[],
    featured: false
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Get category from URL params
        const categoryParam = searchParams.get('category')
        if (categoryParam) {
          setSelectedCategory(categoryParam)
        }
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)

        // Fetch products
        const productsResponse = await fetch('/api/products?limit=50')
        const productsData = await productsResponse.json()
        setProducts(productsData.products || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category._id === selectedCategory)

  const handleAddProduct = () => {
    setEditingProduct(null)
    setSelectedDescription("")
    setFormData({
      name: "",
      price: "",
      category: selectedCategory !== "all" ? selectedCategory : "",
      stock: "",
      description: "",
      images: [],
      featured: false
    })
    setShowProductForm(true)
  }

  const handleDescriptionSelect = (descriptionId: string) => {
    const selectedDesc = PRODUCT_DESCRIPTIONS.find(desc => desc.id === descriptionId)
    if (selectedDesc) {
      setSelectedDescription(descriptionId)
      setFormData(prev => ({
        ...prev,
        description: selectedDesc.description
      }))
    }
  }

  const generateCustomDescription = () => {
    if (formData.name && selectedDescription) {
      const selectedDesc = PRODUCT_DESCRIPTIONS.find(desc => desc.id === selectedDescription)
      if (selectedDesc) {
        const customDescription = `${formData.name} - ${selectedDesc.description}`
        setFormData(prev => ({
          ...prev,
          description: customDescription
        }))
      }
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category._id,
      stock: product.stock.toString(),
      description: product.description || "",
      images: product.images,
      featured: product.featured
    })
    setShowProductForm(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setProducts(products.filter(p => p._id !== productId))
        }
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-[#D4A574] hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-2xl">Manage Products</h1>
          </div>
          <Button
            onClick={handleAddProduct}
            className="bg-[#D4A574] text-black hover:bg-[#C49564] font-sans flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-6">
          <label className="block font-sans text-sm mb-2">Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 font-sans text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Form */}
        <Modal
          isOpen={showProductForm}
          onClose={() => {
            setShowProductForm(false)
            setEditingProduct(null)
            setSelectedDescription("")
            setFormData({
              name: "",
              price: "",
              category: "",
              stock: "",
              description: "",
              images: [],
              featured: false
            })
          }}
          title={editingProduct ? "Edit Product" : "Add New Product"}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-sm mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Silk Elegance Wig"
                    className="w-full px-4 py-2 border border-gray-200 font-sans text-sm"
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm mb-2">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 2850"
                    className="w-full px-4 py-2 border border-gray-200 font-sans text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-sm mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 font-sans text-sm"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-sm mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="e.g., 10"
                    className="w-full px-4 py-2 border border-gray-200 font-sans text-sm"
                  />
                </div>
              </div>

              {/* Pre-made Descriptions */}
              <div>
                <label className="block font-sans text-sm mb-2">Choose Description Template</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {PRODUCT_DESCRIPTIONS.map((desc) => (
                    <div
                      key={desc.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedDescription === desc.id
                          ? 'border-[#D4A574] bg-[#D4A574]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleDescriptionSelect(desc.id)}
                    >
                      <h4 className="font-serif text-sm font-bold mb-2">{desc.title}</h4>
                      <p className="font-sans text-xs text-gray-600 line-clamp-3">{desc.description}</p>
                    </div>
                  ))}
                </div>
                
                {selectedDescription && formData.name && (
                  <Button
                    type="button"
                    onClick={generateCustomDescription}
                    className="mb-4 bg-[#D4A574] text-black hover:bg-[#C49564] font-sans text-sm"
                  >
                    Generate Custom Description
                  </Button>
                )}
              </div>

              <div>
                <label className="block font-sans text-sm mb-2">Product Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 font-sans text-sm"
                />
              </div>

              <div>
                <label className="block font-sans text-sm mb-2">Product Images</label>
                <ImageUpload
                  value={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls as string[] })}
                  multiple={true}
                  folder="metahair/products"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="font-sans text-sm">Featured Product</label>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    try {
                      const productData = {
                        name: formData.name,
                        price: parseFloat(formData.price),
                        category: formData.category,
                        stock: parseInt(formData.stock),
                        description: formData.description,
                        images: formData.images,
                        featured: formData.featured
                      }

                      if (editingProduct) {
                        // Update existing product
                        const response = await fetch(`/api/products/${editingProduct._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(productData)
                        })
                        if (response.ok) {
                          const updatedProduct = await response.json()
                          setProducts(products.map(p => p._id === editingProduct._id ? updatedProduct : p))
                        }
                      } else {
                        // Create new product
                        const response = await fetch('/api/products', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(productData)
                        })
                        if (response.ok) {
                          const newProduct = await response.json()
                          setProducts([...products, newProduct])
                        }
                      }
                      
                      setShowProductForm(false)
                      setEditingProduct(null)
                      setSelectedDescription("")
                      setFormData({
                        name: "",
                        price: "",
                        category: "",
                        stock: "",
                        description: "",
                        images: [],
                        featured: false
                      })
                    } catch (error) {
                      console.error('Error saving product:', error)
                    }
                  }}
                  className="bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans"
                >
                  {editingProduct ? "Update" : "Add"} Product
                </Button>
                <Button
                  onClick={() => {
                    setShowProductForm(false)
                    setEditingProduct(null)
                    setSelectedDescription("")
                    setFormData({
                      name: "",
                      price: "",
                      category: "",
                      stock: "",
                      description: "",
                      images: [],
                      featured: false
                    })
                  }}
                  variant="outline"
                  className="font-sans"
                >
                  Cancel
                </Button>
              </div>
          </div>
        </Modal>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                  <div className="h-9 flex-1 bg-gray-200 rounded"></div>
                  <div className="h-9 flex-1 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white border border-gray-200 overflow-hidden">
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg mb-2">{product.name}</h3>
                <p className="font-sans text-sm text-gray-600 mb-2">{product.category.name}</p>
                <p className="font-sans text-lg font-semibold mb-4">₦{product.price.toLocaleString()}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditProduct(product)}
                    size="sm"
                    variant="outline"
                    className="flex-1 font-sans flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteProduct(product._id)}
                    size="sm"
                    variant="outline"
                    className="flex-1 font-sans flex items-center justify-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-sans">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
