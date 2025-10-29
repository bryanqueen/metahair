"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/lib/admin-context"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function AdminSettingsPage() {
  const router = useRouter()
  const { changePin, adminPin } = useAdmin()
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showNewPin, setShowNewPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Admin email state
  const [adminEmail, setAdminEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [emailSuccess, setEmailSuccess] = useState("")
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  // Load admin email on mount
  useEffect(() => {
    const loadAdminEmail = async () => {
      try {
        const response = await fetch('/api/admin/session', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          if (data.adminEmail) setAdminEmail(data.adminEmail)
        }
      } catch (err) {}
    }
    loadAdminEmail()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Only require new PIN and confirmation (no current PIN needed if authenticated)
    if (newPin.length !== 6 || confirmPin.length !== 6) {
      setError("PINs must be 6 digits")
      return
    }

    if (newPin !== confirmPin) {
      setError("New PIN and confirmation PIN do not match")
      return
    }

    setIsLoading(true)

    try {
      // Pass empty string for oldPin since it's not required when authenticated
      const success = await changePin("", newPin)
      if (success) {
        setSuccess("PIN changed successfully!")
        setCurrentPin("")
        setNewPin("")
        setConfirmPin("")
      } else {
        setError("Failed to change PIN. Please try again.")
      }
    } catch (error) {
      setError("Failed to change PIN. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")
    setEmailSuccess("")

    if (!adminEmail || !adminEmail.includes('@')) {
      setEmailError("Please enter a valid email address")
      return
    }

    setIsEmailLoading(true)
    try {
      const response = await fetch('/api/admin/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ adminEmail })
      })
      if (response.ok) {
        setEmailSuccess("Admin email updated successfully!")
      } else {
        setEmailError("Failed to update email. Please try again.")
      }
    } catch (err) {
      setEmailError("Failed to update email. Please try again.")
    } finally {
      setIsEmailLoading(false)
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
            <h1 className="font-serif text-2xl">Admin Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="font-serif text-2xl mb-6">Change Admin PIN</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info message */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded font-sans text-sm mb-6">
              Since you're already logged in, you can change your PIN without entering the current one.
            </div>

            {/* New PIN */}
            <div>
              <label className="block font-sans text-sm mb-2">New PIN</label>
              <div className="relative">
                <input
                  type={showNewPin ? "text" : "password"}
                  value={newPin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setNewPin(value)
                    setError("")
                  }}
                  placeholder="Enter new 6-digit PIN"
                  className="w-full px-4 py-3 border border-gray-200 font-sans text-lg tracking-widest text-center"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPin(!showNewPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm PIN */}
            <div>
              <label className="block font-sans text-sm mb-2">Confirm New PIN</label>
              <div className="relative">
                <input
                  type={showConfirmPin ? "text" : "password"}
                  value={confirmPin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setConfirmPin(value)
                    setError("")
                  }}
                  placeholder="Confirm new 6-digit PIN"
                  className="w-full px-4 py-3 border border-gray-200 font-sans text-lg tracking-widest text-center"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded font-sans text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded font-sans text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || newPin.length !== 6 || confirmPin.length !== 6}
              className="w-full bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans py-3"
            >
              {isLoading ? "Changing PIN..." : "Change PIN"}
            </Button>
          </form>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-serif text-sm mb-2">Security Note</h3>
            <p className="font-sans text-xs text-yellow-800">
              Make sure to choose a strong PIN that's different from your current one. 
              Keep your PIN secure and don't share it with anyone.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="font-serif text-2xl mb-6">Admin Email Configuration</h2>
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded font-sans text-sm mb-6">
              This email will receive order notifications and confirmations.
            </div>
            <div>
              <label className="block font-sans text-sm mb-2">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => { setAdminEmail(e.target.value); setEmailError("") }}
                placeholder="Enter admin email address"
                className="w-full px-4 py-3 border border-gray-200 font-sans"
                required
              />
            </div>
            {emailError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded font-sans text-sm">{emailError}</div>
            )}
            {emailSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded font-sans text-sm">{emailSuccess}</div>
            )}
            <Button
              type="submit"
              disabled={isEmailLoading || !adminEmail}
              className="w-full bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans py-3"
            >
              {isEmailLoading ? "Updating Email..." : "Update Email"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}