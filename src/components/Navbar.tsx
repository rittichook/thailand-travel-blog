'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-[#0D9488]">
          🗺️ เที่ยวทั่วไทย
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/categories/nature" className="hover:text-[#0D9488] transition-colors">ธรรมชาติ</Link>
          <Link href="/categories/beach" className="hover:text-[#0D9488] transition-colors">ชายหาด</Link>
          <Link href="/categories/temple" className="hover:text-[#0D9488] transition-colors">วัด</Link>
          <Link href="/categories/culture" className="hover:text-[#0D9488] transition-colors">วัฒนธรรม</Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="เปิดเมนู"
          aria-expanded={open}
        >
          <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-0.5 bg-gray-700"></span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 text-sm font-medium bg-white">
          <Link href="/categories/nature" onClick={() => setOpen(false)}>ธรรมชาติ</Link>
          <Link href="/categories/beach" onClick={() => setOpen(false)}>ชายหาด</Link>
          <Link href="/categories/temple" onClick={() => setOpen(false)}>วัด</Link>
          <Link href="/categories/culture" onClick={() => setOpen(false)}>วัฒนธรรม</Link>
        </div>
      )}
    </nav>
  )
}
