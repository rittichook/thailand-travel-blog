'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'

const navLinkClass =
  'relative py-1 hover:text-[#0D9488] dark:hover:text-teal-400 transition-colors ' +
  "after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-[#0D9488] dark:after:bg-teal-400 after:transition-all after:duration-300 hover:after:w-full"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-stone-900 shadow-sm dark:shadow-black/30 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="group font-bold text-xl text-[#0D9488] dark:text-teal-400 flex items-center gap-1.5"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">🗺️</span>
          <span>เที่ยวทั่วไทย</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/categories/nature" className={navLinkClass}>ธรรมชาติ</Link>
          <Link href="/categories/beach" className={navLinkClass}>ชายหาด</Link>
          <Link href="/categories/temple" className={navLinkClass}>วัด</Link>
          <Link href="/categories/culture" className={navLinkClass}>วัฒนธรรม</Link>
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 group"
            onClick={() => setOpen(!open)}
            aria-label="เปิดเมนู"
            aria-expanded={open}
          >
            <span className={`block w-6 h-0.5 bg-gray-700 dark:bg-stone-300 mb-1 transition-all duration-300 origin-center ${open ? 'translate-y-1.5 rotate-45' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 dark:bg-stone-300 mb-1 transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 dark:bg-stone-300 transition-all duration-300 origin-center ${open ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t dark:border-stone-800 bg-white dark:bg-stone-900 ${
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 border-t-0'
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <Link href="/categories/nature" onClick={() => setOpen(false)} className="hover:text-[#0D9488] dark:hover:text-teal-400 transition-colors">ธรรมชาติ</Link>
          <Link href="/categories/beach" onClick={() => setOpen(false)} className="hover:text-[#0D9488] dark:hover:text-teal-400 transition-colors">ชายหาด</Link>
          <Link href="/categories/temple" onClick={() => setOpen(false)} className="hover:text-[#0D9488] dark:hover:text-teal-400 transition-colors">วัด</Link>
          <Link href="/categories/culture" onClick={() => setOpen(false)} className="hover:text-[#0D9488] dark:hover:text-teal-400 transition-colors">วัฒนธรรม</Link>
        </div>
      </div>
    </nav>
  )
}
