"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ShippingMethod {
  _id: string
  name: string
  price: number
  description?: string
  estimatedDays?: number
}

export default function AdminShippingPage() {
  const router = useRouter()
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null)
  const [formData, setFormData] = useState({ name: "", price: "", description: "", estimatedDays: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShippingMethods()
  }, [])

  const fetchShippingMethods = async () => {
    try {
      const response = await fetch('/api/shippping-methods')
      const data = await response.json()
      setShippingMethods(data)
    } catch (error) {
      console.error('Error fetching shipping methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMethod = async () => {
    if (formData.name && formData.price) {
      try {
        if (editingMethod) {
          // Update existing method
          const response = await fetch(`/api/shippping-methods/${editingMethod._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              price: Number(formData.price),
              description: formData.description,
              estimatedDays: formData.estimatedDays ? Number(formData.estimatedDays) : undefined,
            })
          })
          if (response.ok) {
            const updatedMethod = await response.json()
            setShippingMethods(shippingMethods.map((m) => (m._id === editingMethod._id ? updatedMethod : m)))
            setEditingMethod(null)
          }
        } else {
          // Create new method
          const response = await fetch('/api/shippping-methods', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              price: Number(formData.price),
              description: formData.description,
              estimatedDays: formData.estimatedDays ? Number(formData.estimatedDays) : undefined,
            })
          })
          if (response.ok) {
            const newMethod = await response.json()
            setShippingMethods([...shippingMethods, newMethod])
          }
        }
        setFormData({ name: "", price: "", description: "", estimatedDays: "" })
        setShowForm(false)
      } catch (error) {
        console.error('Error saving shipping method:', error)
      }
    }
  }

  const handleDeleteMethod = async (id: string) => {
    if (confirm("Are you sure you want to delete this shipping method?")) {
      try {
        const response = await fetch(`/api/shippping-methods/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setShippingMethods(shippingMethods.filter((m) => m._id !== id))
        }
      } catch (error) {
        console.error('Error deleting shipping method:', error)
      }
    }
  }

  const handleEditMethod = (method: ShippingMethod) => {
    setEditingMethod(method)
    setFormData({ 
      name: method.name, 
      price: method.price.toString(),
      description: method.description || "",
      estimatedDays: method.estimatedDays?.toString() || ""
    })
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <h1 className="font-serif text-2xl">Manage Shipping Methods</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans text-sm">Back to Dashboard</span>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl">Shipping Methods</h2>
          <Button
            onClick={() => {
              setEditingMethod(null)
              setFormData({ name: "", price: "", description: "", estimatedDays: "" })
              setShowForm(!showForm)
            }}
            className="bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Method
          </Button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 p-6 mb-8 rounded-lg">
            <h3 className="font-serif text-lg mb-4">{editingMethod ? "Edit Method" : "Add New Method"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-sans text-sm mb-2">Method Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Within Lagos"
                  className="w-full px-4 py-2 border border-gray-200 font-sans text-sm"
                />
              </div>
              <div>
                <label className="block font-sans text-sm mb-2">Price (₦)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 2500"
                  className="w-full px-4 py-2 border border-gray-200 font-sans text-sm"
                />
              </div>
              <div>
                <label className="block font-sans text-sm mb-2">Description (Optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Delivery within Lagos state"
                  className="w-full px-4 py-2 border border-gray-200 font-sans text-sm"
                />
              </div>
              <div>
                <label className="block font-sans text-sm mb-2">Estimated Days (Optional)</label>
                <input
                  type="number"
                  value={formData.estimatedDays}
                  onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
                  placeholder="e.g., 3"
                  className="w-full px-4 py-2 border border-gray-200 font-sans text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddMethod}
                  className="bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans"
                >
                  {editingMethod ? "Update" : "Add"}
                </Button>
                <Button
                  onClick={() => {
                    setShowForm(false)
                    setEditingMethod(null)
                    setFormData({ name: "", price: "", description: "", estimatedDays: "" })
                  }}
                  variant="outline"
                  className="font-sans"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
            <p className="font-sans text-gray-600">Loading shipping methods...</p>
          </div>
        ) : (

        <div className="space-y-4">
          {shippingMethods.map((method) => (
            <div key={method._id} className="bg-white border border-gray-200 p-6 flex items-center justify-between rounded-lg">
              <div>
                <h3 className="font-serif text-lg">{method.name}</h3>
                <p className="text-gray-600 font-sans text-sm">₦{method.price.toLocaleString()}</p>
                {method.description && (
                  <p className="text-gray-500 font-sans text-xs mt-1">{method.description}</p>
                )}
                {method.estimatedDays && (
                  <p className="text-gray-500 font-sans text-xs">Est. {method.estimatedDays} days</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEditMethod(method)}
                  size="sm"
                  variant="outline"
                  className="font-sans flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteMethod(method._id)}
                  size="sm"
                  variant="outline"
                  className="font-sans flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}
