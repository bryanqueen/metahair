"use client"

import { useState, useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { Modal } from "@/components/ui/modal"
import { LogOut, Plus, Edit2, Trash2, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Category {
  _id: string
  name: string
  image: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { logout } = useAdmin()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"orders" | "categories" | "shipping" | "products" | "settings">("orders")
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: "", image: "" })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/categories')
        const data = await response.json()
        
        // Check if response has error
        if (!response.ok || data.error) {
          setError(data.error || 'Failed to fetch categories. Please check your MongoDB connection.')
          setCategories([])
          return
        }
        
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setCategories(data)
        } else {
          console.error('Error fetching categories: Invalid response format', data)
          setError('Invalid response from server')
          setCategories([])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('Failed to connect to the database. Please check your configuration.')
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const handleAddCategory = async () => {
    if (formData.name && formData.image) {
      try {
        setError(null)
        if (editingCategory) {
          // Update existing category
          const response = await fetch(`/api/categories/${editingCategory._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          })
          if (response.ok) {
            const updatedCategory = await response.json()
            setCategories(categories.map((c) => (c._id === editingCategory._id ? updatedCategory : c)))
            setEditingCategory(null)
          } else {
            const errorData = await response.json()
            setError(errorData.error || 'Failed to update category')
          }
        } else {
          // Create new category
          const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          })
          if (response.ok) {
            const newCategory = await response.json()
            setCategories([...categories, newCategory])
          } else {
            const errorData = await response.json()
            setError(errorData.error || 'Failed to create category')
          }
        }
        setFormData({ name: "", image: "" })
        setShowCategoryForm(false)
      } catch (error) {
        console.error('Error saving category:', error)
        setError('Network error. Please check your connection and try again.')
      }
    }
  }

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  const confirmDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        const response = await fetch(`/api/categories/${categoryToDelete._id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setCategories(categories.filter((c) => c._id !== categoryToDelete._id))
        }
      } catch (error) {
        console.error('Error deleting category:', error)
      }
      setShowDeleteModal(false)
      setCategoryToDelete(null)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, image: category.image })
    setShowCategoryForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
          <p className="font-sans text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl">Welcome, Admin</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 hover:bg-[#D4A574] hover:text-black transition-colors font-sans text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {[
            { id: "orders", label: "Orders" },
            { id: "categories", label: "Categories" },
            { id: "shipping", label: "Shipping Methods" },
            { id: "products", label: "Products" },
            { id: "settings", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-sans text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "border-black text-black" : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="font-serif text-2xl mb-6">Order Management</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg mb-2">No Orders Yet</h3>
                <p className="text-gray-600 font-sans text-sm mb-4">Orders will appear here once customers start placing them.</p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans">
                    View All Orders
                  </Button>
                  <Button variant="outline" className="font-sans">
                    Export Orders
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl">Manage Categories</h2>
              <Button
                onClick={() => {
                  setEditingCategory(null)
                  setFormData({ name: "", image: "" })
                  setShowCategoryForm(!showCategoryForm)
                }}
                className="text-xs bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 font-sans text-sm relative">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <strong className="font-medium">Database Connection Error</strong>
                    <p className="mt-1">{error}</p>
                    <div className="mt-3 text-xs">
                      <p className="font-medium mb-1">To fix this:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Ensure your `.env.local` file has a valid `MONGODB_URI`</li>
                        <li>For MongoDB Atlas, use format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`</li>
                        <li>For local MongoDB, use format: `mongodb://localhost:27017/metahair`</li>
                        <li>Restart your development server after updating `.env.local`</li>
                      </ol>
                    </div>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-700 hover:text-red-900 flex-shrink-0"
                    aria-label="Dismiss error"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <Modal
              isOpen={showCategoryForm}
              onClose={() => {
                setShowCategoryForm(false)
                setEditingCategory(null)
                setFormData({ name: "", image: "" })
              }}
              title={editingCategory ? "Edit Category" : "Add New Category"}
            >
              <div className="space-y-4">
                  <div>
                    <label className="block font-sans text-sm mb-2">Category Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Lace Front Wigs"
                      className="w-full px-4 py-2 border border-gray-200 font-sans text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm mb-2">Category Image</label>
                    <ImageUpload
                      value={formData.image}
                      onChange={(url) => setFormData({ ...formData, image: url as string })}
                      folder="metahair/categories"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddCategory}
                      className="bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans"
                    >
                      {editingCategory ? "Update" : "Add"}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowCategoryForm(false)
                        setEditingCategory(null)
                        setFormData({ name: "", image: "" })
                      }}
                      variant="outline"
                      className="font-sans"
                    >
                      Cancel
                    </Button>
                  </div>
              </div>
            </Modal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category._id} className="bg-white border border-gray-200 overflow-hidden">
                  <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg mb-4">{category.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditCategory(category)}
                        size="sm"
                        variant="outline"
                        className="flex-1 font-sans flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteCategory(category)}
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
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === "shipping" && (
          <div>
            <Link href="/admin/shipping">
              <Button className="bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans">
                Manage Shipping Methods
              </Button>
            </Link>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <h2 className="font-serif text-2xl mb-6">Manage Products</h2>
            <p className="text-gray-600 font-sans">Select a category to manage its products</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {categories.map((category) => (
                <Link key={category._id} href={`/admin/products?category=${category._id}`}>
                  <div className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <h3 className="font-serif text-lg">{category.name}</h3>
                    <p className="text-gray-600 font-sans text-sm mt-2">Manage products in this category</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <Link href="/admin/settings">
              <Button className="bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Change PIN
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="font-serif text-lg mb-4">Delete Category</h3>
            <p className="text-gray-600 font-sans text-sm mb-6">
              Are you sure you want to delete "{categoryToDelete?.name}"? This action will also remove all products under this category and cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => {
                  setShowDeleteModal(false)
                  setCategoryToDelete(null)
                }}
                variant="outline"
                className="font-sans"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteCategory}
                className="bg-red-600 text-white hover:bg-red-700 font-sans"
              >
                Delete Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
