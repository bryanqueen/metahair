"use client"

import { useCart } from "@/lib/cart-context"

export function CartCounter() {
  const { cartCount } = useCart()

  if (cartCount === 0) return null

  return (
    <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-5 h-5 flex items-center justify-center font-semibold">
      {cartCount}
    </span>
  )
}
