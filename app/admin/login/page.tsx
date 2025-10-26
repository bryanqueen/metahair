"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/lib/admin-context"
import Image from "next/image"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAdmin()
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePinChange = (value: string) => {
    // Only allow digits and max 6 characters
    const numericValue = value.replace(/\D/g, "").slice(0, 6)
    setPin(numericValue)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (pin.length !== 6) {
      setError("PIN must be 6 digits")
      setIsLoading(false)
      return
    }

    try {
      const success = await login(pin)
      if (success) {
        router.push("/admin/dashboard")
      } else {
        setError("Invalid PIN")
        setPin("")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
      setPin("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8 bg-black py-12 rounded-xl">
          <Image src="/metahair_logo_2.png" alt="METAHAIR" width={200} height={80} className="h-16 w-auto" />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">Admin Access</h1>
          <p className="text-gray-600 font-sans text-sm">Enter your 6-digit PIN to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-sans text-sm mb-2">PIN</label>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="password"
                  maxLength={1}
                  value={pin[index] || ""}
                  onChange={(e) => {
                    const newPin = pin.split("")
                    newPin[index] = e.target.value.replace(/\D/g, "")
                    handlePinChange(newPin.join(""))
                    // Auto-focus next input
                    if (e.target.value && index < 5) {
                      const nextInput = document.querySelector(
                        `input[data-pin-index="${index + 1}"]`,
                      ) as HTMLInputElement
                      nextInput?.focus()
                    }
                  }}
                  onKeyDown={(e) => {
                    // Handle backspace to go to previous input
                    if (e.key === "Backspace" && !pin[index] && index > 0) {
                      const prevInput = document.querySelector(
                        `input[data-pin-index="${index - 1}"]`,
                      ) as HTMLInputElement
                      prevInput?.focus()
                    }
                    // Handle arrow keys for navigation
                    if (e.key === "ArrowLeft" && index > 0) {
                      const prevInput = document.querySelector(
                        `input[data-pin-index="${index - 1}"]`,
                      ) as HTMLInputElement
                      prevInput?.focus()
                    }
                    if (e.key === "ArrowRight" && index < 5) {
                      const nextInput = document.querySelector(
                        `input[data-pin-index="${index + 1}"]`,
                      ) as HTMLInputElement
                      nextInput?.focus()
                    }
                  }}
                  data-pin-index={index}
                  className="w-12 h-12 text-center text-2xl font-serif border-2 border-gray-300 focus:border-[#D4A574] focus:outline-none transition-colors"
                />
              ))}
            </div>
            {error && <p className="text-red-600 text-sm mt-2 text-center font-sans">{error}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading || pin.length !== 6}
            className="w-full bg-black text-white hover:bg-[#D4A574] hover:text-black font-sans py-3"
          >
            {isLoading ? "Verifying..." : "Login"}
          </Button>
        </form>

        {/* Info */}
        <p className="text-center text-gray-500 font-sans text-xs mt-6">Default PIN: 123456 (Change on first login)</p>
      </div>
    </div>
  )
}
