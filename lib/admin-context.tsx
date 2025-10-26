"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminContextType {
  isAuthenticated: boolean
  adminPin: string
  setAdminPin: (pin: string) => void
  login: (pin: string) => Promise<boolean>
  logout: () => void
  changePin: (oldPin: string, newPin: string) => Promise<boolean>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Default PIN set during development - should be changed by admin on first login
const DEFAULT_ADMIN_PIN = "123456"

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPin, setAdminPinState] = useState(DEFAULT_ADMIN_PIN)

  // Load admin data on mount (non-blocking)
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        // Check for existing session cookie
        const response = await fetch('/api/admin/session', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setIsAuthenticated(data.authenticated)
          setAdminPinState(data.pin || DEFAULT_ADMIN_PIN)
        }
      } catch (error) {
        console.error('Error loading admin session:', error)
      }
    }

    loadAdminData()
  }, [])

  const login = async (pin: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pin })
      })

      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        setAdminPinState(data.pin)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsAuthenticated(false)
    }
  }

  const changePin = async (oldPin: string, newPin: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPin }) // Only send new PIN since user is already authenticated
      })

      if (response.ok) {
        const data = await response.json()
        setAdminPinState(data.pin)
        return true
      }
      return false
    } catch (error) {
      console.error('Change PIN error:', error)
      return false
    }
  }

  const setAdminPin = (pin: string) => {
    setAdminPinState(pin)
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, adminPin, setAdminPin, login, logout, changePin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
