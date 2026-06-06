import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import React from 'react'
import './styles.css'
import { Navbar } from '@/components/Navbar'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sarabun',
})

export const metadata: Metadata = {
  title: {
    template: '%s | เที่ยวทั่วไทย',
    default: 'เที่ยวทั่วไทย — ค้นพบสถานที่ท่องเที่ยวทั่วประเทศ',
  },
  description: 'รวมบทความและรีวิวสถานที่ท่องเที่ยวทั่วประเทศไทย',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="bg-[#1C1917] text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm opacity-60">© 2026 เที่ยวทั่วไทย — สงวนลิขสิทธิ์</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
