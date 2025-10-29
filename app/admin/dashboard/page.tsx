"use client"

import { useState, useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { Modal } from "@/components/ui/modal"
import { LogOut, Plus, Edit2, Trash2, Settings, Copy, Check } from "lucide-react"
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
  const [orders, setOrders] = useState<any[]>([])
  const [orderStatusFilter, setOrderStatusFilter] = useState<'processing' | 'shipped' | 'delivered' | 'cancelled'>('processing')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [copied, setCopied] = useState(false)
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

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders?limit=100')
        if (res.ok) {
          const data = await res.json()
          const list = (data.orders || []) as any[]
          // hide unpaid/pending orders by default
          const nonPending = list.filter(o => (o.paymentStatus !== 'pending') && (o.status !== 'pending'))
          setOrders(nonPending)
        }
      } catch (e) {}
    }

    fetchCategories()
    fetchOrders()
  }, [])

  useEffect(() => {
    if (showOrderModal && selectedOrder?._id) {
      const fetchFullOrder = async () => {
        try {
          const res = await fetch(`/api/orders/${selectedOrder._id}`)
          if (res.ok) {
            const fullOrder = await res.json()
            setSelectedOrder(fullOrder)
          }
        } catch (e) {}
      }
      fetchFullOrder()
    }
  }, [showOrderModal, selectedOrder?._id])

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
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {[{id:'processing',label:'Processing'},{id:'shipped',label:'Shipped'},{id:'delivered',label:'Delivered'},{id:'cancelled',label:'Cancelled'}].map((f:any) => (
                  <button key={f.id} onClick={() => setOrderStatusFilter(f.id)} className={`px-3 py-1 border text-xs font-sans ${orderStatusFilter===f.id ? 'bg-black text-white' : 'bg-white text-gray-700'}`}>{f.label}</button>
                ))}
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="font-serif text-lg mb-2">No Orders Yet</h3>
                  <p className="text-gray-600 font-sans text-sm mb-4">Orders will appear here once customers start placing them.</p>
                </div>
              ) : (
                <>
                  {/* Mobile Cards */}
                  <div className="grid grid-cols-1 gap-3 md:hidden">
                    {orders.filter(o => o.status===orderStatusFilter).map((o) => (
                      <div key={o._id} className="border border-gray-200 rounded p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs truncate max-w-[60%]">{o.orderNumber}</span>
                          <span className="text-xs capitalize px-2 py-0.5 border">{o.status}</span>
                        </div>
                        <div className="text-sm text-gray-700 truncate">{o.customerName || '-'}</div>
                        <div className="text-sm mt-1">₦{o.total?.toLocaleString?.()}</div>
                        <div className="text-xs text-gray-500 mt-1 truncate">{new Date(o.createdAt).toLocaleString()}</div>
                        <Button onClick={() => { setSelectedOrder(o); setShowOrderModal(true) }} className="w-full mt-3 bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans text-xs">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-600 border-b border-gray-200">
                          <th className="py-3">Order #</th>
                          <th className="py-3">Customer</th>
                          <th className="py-3">Total</th>
                          <th className="py-3">Status</th>
                          <th className="py-3">Date</th>
                          <th className="py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.filter(o => o.status===orderStatusFilter).map((o) => (
                          <tr key={o._id} className="border-b border-gray-100">
                            <td className="py-3 font-mono max-w-[180px] truncate">{o.orderNumber}</td>
                            <td className="py-3 max-w-[220px] truncate">{o.customerName || '-'}</td>
                            <td className="py-3">₦{o.total?.toLocaleString?.()}</td>
                            <td className="py-3 capitalize">
                              <span className="px-2 py-0.5 border text-xs">{o.status}</span>
                            </td>
                            <td className="py-3 whitespace-nowrap">{new Date(o.createdAt).toLocaleString()}</td>
                            <td className="py-3">
                              <Button onClick={() => { setSelectedOrder(o); setShowOrderModal(true) }} className="bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans text-xs">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
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
                Change PIN / Update Email Address
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <Modal
          isOpen={showOrderModal}
          onClose={() => {
            setShowOrderModal(false)
            setSelectedOrder(null)
            setCopied(false)
          }}
          title={`Order ${selectedOrder.orderNumber}`}
        >
          <div className="space-y-4">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-sans mb-1">Customer Name</p>
                <p className="font-sans">{selectedOrder.customerName || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-sans mb-1">Customer Email</p>
                <p className="font-sans text-sm truncate">{selectedOrder.customerEmail || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-sans mb-1">Phone</p>
                <p className="font-sans">{selectedOrder.customerPhone || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-sans mb-1">Date</p>
                <p className="font-sans text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-sans">Shipping Address</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedOrder.shippingAddress || '')
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-black font-sans"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="font-sans text-sm bg-gray-50 p-3 rounded border">{selectedOrder.shippingAddress || '-'}</p>
            </div>

            {/* Order Items */}
            <div>
              <p className="text-xs text-gray-500 font-sans mb-2">Items</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-sans text-sm">{item.productName}</p>
                      <p className="font-sans text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-sans text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between font-sans text-sm">
                <span>Subtotal</span>
                <span>₦{selectedOrder.subtotal?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between font-sans text-sm">
                <span>Shipping</span>
                <span>₦{selectedOrder.shippingCost?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between font-serif font-semibold border-t pt-2">
                <span>Total</span>
                <span>₦{selectedOrder.total?.toLocaleString() || '0'}</span>
              </div>
            </div>

            {/* Status Update */}
            <div className="border-t pt-4">
              <p className="text-xs text-gray-500 font-sans mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {['processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={async () => {
                      const res = await fetch(`/api/orders/${selectedOrder._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status })
                      })
                      if (res.ok) {
                        const updated = await res.json()
                        setSelectedOrder(updated)
                        setOrders(prev => prev.map(o => o._id === selectedOrder._id ? updated : o))
                      }
                    }}
                    className={`px-3 py-1.5 text-xs border font-sans capitalize ${
                      selectedOrder.status === status
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

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
