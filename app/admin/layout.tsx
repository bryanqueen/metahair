"use client"

import type React from "react"

import { useAdmin } from "@/lib/admin-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  // Don't redirect if we're already on the login page
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router, isLoginPage])

  // If not authenticated and not on login page, show nothing
  if (!isAuthenticated && !isLoginPage) {
    return null
  }

  return <>{children}</>
}
