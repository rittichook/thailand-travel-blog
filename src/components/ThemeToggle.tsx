'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
  }

  const showSun = mounted && isDark

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative p-2 w-9 h-9 rounded-full text-lg leading-none overflow-hidden hover:bg-stone-100 dark:hover:bg-stone-800 hover:scale-110 active:scale-95 transition-all duration-300"
      aria-label={showSun ? 'สลับเป็นธีมสว่าง' : 'สลับเป็นธีมมืด'}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
          showSun ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        🌙
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
          showSun ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
        }`}
      >
        ☀️
      </span>
    </button>
  )
}
