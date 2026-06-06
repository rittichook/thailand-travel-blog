'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/categories/nature', label: 'ธรรมชาติ' },
    { href: '/categories/beach', label: 'ชายหาด' },
    { href: '/categories/temple', label: 'วัด' },
    { href: '/categories/culture', label: 'วัฒนธรรม' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <span aria-hidden="true">🗺️</span>
          <span>เที่ยวทั่วไทย</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-stone-600 dark:text-stone-300 hover:text-[#0D9488] dark:hover:text-teal-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <span className="h-5 w-px bg-stone-200 dark:bg-stone-700" />
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 -mr-2"
            onClick={() => setOpen(!open)}
            aria-label="เปิดเมนู"
            aria-expanded={open}
          >
            <span className={`block w-5 h-px bg-stone-700 dark:bg-stone-300 transition-transform ${open ? 'translate-y-[5px] rotate-45' : 'mb-[5px]'}`}></span>
            <span className={`block w-5 h-px bg-stone-700 dark:bg-stone-300 transition-opacity ${open ? 'opacity-0' : 'mb-[5px]'}`}></span>
            <span className={`block w-5 h-px bg-stone-700 dark:bg-stone-300 transition-transform ${open ? '-translate-y-[5px] -rotate-45' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 px-4 py-4 flex flex-col gap-4 text-sm text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="hover:text-[#0D9488] dark:hover:text-teal-400 transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
