"use client"

import Image from "next/image"
import { Instagram, Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Image
              src="/metahair_logo_2.png"
              alt="METAHAIR"
              width={180}
              height={60}
              className="h-12 w-auto mb-6"
            />
            <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-md">
              Elevate your style with premium luxury wigs crafted to perfection. Experience unparalleled quality and
              elegance with METAHAIR.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg mb-4 text-[#D4A574]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/new-arrivals" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="/shop" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">
                  Shop All
                </a>
              </li>
              <li>
                <a href="/faqs" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          {/* <div>
            <h3 className="font-serif text-lg mb-4 text-[#D4A574]">Customer Service</h3>
            <ul className="space-y-3">

              <li>
                <a href="/shipping" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="/size-guide" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="/care" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">
                  Care Instructions
                </a>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Media */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-[#D4A574] transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#D4A574] transition-colors" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#D4A574] transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm font-sans">© 2025 METAHAIR. All rights reserved.</p>

          {/* Legal Links */}
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm font-sans">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
