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

  return (
    <button
      type="button"
      onClick={toggle}
      className="p-2 rounded-full text-lg leading-none hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      aria-label={mounted && isDark ? 'สลับเป็นธีมสว่าง' : 'สลับเป็นธีมมืด'}
    >
      <span aria-hidden="true">{mounted && isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}
