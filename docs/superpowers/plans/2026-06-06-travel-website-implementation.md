# Thailand Travel Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้างเว็บไซต์อัพเดตสถานที่ท่องเที่ยวไทย ด้วย Next.js 15 + Payload CMS v3 + Supabase Postgres พร้อม deploy บน Vercel

**Architecture:** Next.js 15 App Router พร้อม Payload CMS v3 embedded — ทุกอย่างใน repo เดียว admin panel อยู่ที่ `/admin` Supabase Postgres เป็น database หลัก หน้า public ใช้ SSG + ISR

**Tech Stack:** Next.js 15, Payload CMS v3, Supabase Postgres, Tailwind CSS v4, TypeScript, Vercel, GitHub

---

## File Map

| File | Responsibility |
|------|---------------|
| `payload.config.ts` | Payload CMS configuration หลัก — collections, db adapter |
| `src/collections/Places.ts` | Place collection definition |
| `src/collections/Provinces.ts` | Province collection definition |
| `src/collections/Categories.ts` | Category collection definition |
| `src/collections/Media.ts` | Media collection definition |
| `src/app/(frontend)/page.tsx` | หน้าแรก — hero, featured, categories, latest |
| `src/app/(frontend)/สถานที่/[slug]/page.tsx` | หน้าบทความสถานที่ |
| `src/app/(frontend)/จังหวัด/[slug]/page.tsx` | หน้ารวมสถานที่ตามจังหวัด |
| `src/app/(frontend)/ประเภท/[slug]/page.tsx` | หน้ารวมสถานที่ตามประเภท |
| `src/app/(frontend)/layout.tsx` | Frontend layout — Navbar, font, global styles |
| `src/app/(payload)/admin/[[...segments]]/page.tsx` | Payload admin entry point |
| `src/components/Navbar.tsx` | Navigation bar component |
| `src/components/PlaceCard.tsx` | Card component สำหรับแสดงสถานที่ |
| `src/components/HeroSection.tsx` | Hero section หน้าแรก |
| `src/components/Gallery.tsx` | Photo gallery + lightbox |
| `src/components/RichText.tsx` | Render Payload Lexical rich text |
| `src/lib/payload.ts` | Payload local API helpers |
| `src/app/globals.css` | Global CSS + Tailwind v4 theme tokens |
| `CLAUDE.md` | Project context สำหรับ Claude agents |
| `project.md` | Project overview document |
| `task.md` | Task tracking document |
| `.claude/settings.json` | Claude Code permissions + hooks |
| `.claude/skills/` | Project-specific skills |
| `.env.example` | Template environment variables |
| `.gitignore` | Git ignore rules |
| `next.config.ts` | Next.js configuration |

---

## Task 1: Initialize Next.js + Payload CMS Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `payload.config.ts`
- Create: `.env.example`, `.env.local`, `.gitignore`

- [ ] **Step 1: สร้าง Next.js + Payload CMS project ด้วย create-payload-app**

```bash
cd /Users/kaizenburi/blog
npx create-payload-app@latest . --template blank --db postgres --no-git
```

เลือก options:
- Template: blank
- Database: postgres
- ไม่ต้อง init git (เราทำเองทีหลัง)

- [ ] **Step 2: ติดตั้ง dependencies เพิ่มเติม**

```bash
npm install @payloadcms/db-postgres @payloadcms/richtext-lexical sharp
npm install -D @types/node
```

- [ ] **Step 3: ติดตั้ง Tailwind CSS v4**

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

สร้าง `postcss.config.mjs`:
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

- [ ] **Step 4: ตั้งค่า .env.local**

สร้างไฟล์ `.env.local` (ไม่ commit):
```bash
DATABASE_URI=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
PAYLOAD_SECRET=your-secret-key-min-32-chars-change-this
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

สร้าง `.env.example` (commit ได้):
```bash
DATABASE_URI=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
PAYLOAD_SECRET=your-secret-key-min-32-chars-change-this
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

- [ ] **Step 5: อัพเดต .gitignore**

```
# dependencies
node_modules/
.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# payload
/public/media
```

- [ ] **Step 6: ตรวจสอบ next.config.ts ให้รองรับ Payload**

แก้ `next.config.ts`:
```typescript
import { withPayload } from '@payloadcms/next'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

export default withPayload(nextConfig)
```

- [ ] **Step 7: Commit**

```bash
git init
git add -A
git commit -m "feat: initialize Next.js 15 + Payload CMS v3 project"
```

---

## Task 2: ตั้งค่า Payload Collections

**Files:**
- Create: `src/collections/Media.ts`
- Create: `src/collections/Categories.ts`
- Create: `src/collections/Provinces.ts`
- Create: `src/collections/Places.ts`
- Modify: `payload.config.ts`

- [ ] **Step 1: สร้าง Media collection**

สร้าง `src/collections/Media.ts`:
```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'public/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
    },
  ],
}
```

- [ ] **Step 2: สร้าง Categories collection**

สร้าง `src/collections/Categories.ts`:
```typescript
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'ชื่อประเภท',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly name เช่น "ธรรมชาติ", "ชายหาด"',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (emoji)',
      admin: {
        description: 'เช่น 🌿 🏖️ ⛩️',
      },
    },
  ],
}
```

- [ ] **Step 3: สร้าง Provinces collection**

สร้าง `src/collections/Provinces.ts`:
```typescript
import type { CollectionConfig } from 'payload'

export const Provinces: CollectionConfig = {
  slug: 'provinces',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'ชื่อจังหวัด',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
    },
    {
      name: 'region',
      type: 'select',
      label: 'ภาค',
      required: true,
      options: [
        { label: 'ภาคเหนือ', value: 'north' },
        { label: 'ภาคกลาง', value: 'central' },
        { label: 'ภาคใต้', value: 'south' },
        { label: 'ภาคอีสาน', value: 'northeast' },
        { label: 'ภาคตะวันออก', value: 'east' },
        { label: 'ภาคตะวันตก', value: 'west' },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: 'รูปปก',
      relationTo: 'media',
    },
  ],
}
```

- [ ] **Step 4: สร้าง Places collection**

สร้าง `src/collections/Places.ts`:
```typescript
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Places: CollectionConfig = {
  slug: 'places',
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'province', 'category', 'status', 'publishedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'ชื่อสถานที่',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly เช่น "เขาใหญ่", "หาดป่าตอง"',
      },
    },
    {
      name: 'province',
      type: 'relationship',
      label: 'จังหวัด',
      relationTo: 'provinces',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'ประเภท',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: 'รูปหลัก',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery รูปภาพ',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'เนื้อหาบทความ',
      editor: lexicalEditor({}),
      required: true,
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'จุดเด่น',
      maxRows: 5,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'travelTips',
      type: 'richText',
      label: 'เคล็ดลับการเดินทาง',
      editor: lexicalEditor({}),
    },
    {
      name: 'status',
      type: 'select',
      label: 'สถานะ',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'วันที่เผยแพร่',
      admin: {
        condition: (data) => data.status === 'published',
      },
    },
  ],
}
```

- [ ] **Step 5: อัพเดต payload.config.ts**

แก้ `payload.config.ts`:
```typescript
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Places } from './src/collections/Places'
import { Provinces } from './src/collections/Provinces'
import { Categories } from './src/collections/Categories'
import { Media } from './src/collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [Places, Provinces, Categories, Media],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  sharp,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
})
```

- [ ] **Step 6: รัน dev server ตรวจสอบว่า compile ผ่าน**

```bash
npm run dev
```

Expected: server เริ่มที่ http://localhost:3000 ไม่มี TypeScript error, `/admin` เข้าได้

- [ ] **Step 7: Commit**

```bash
git add src/collections/ payload.config.ts
git commit -m "feat: add Payload CMS collections (Places, Provinces, Categories, Media)"
```

---

## Task 3: ตั้งค่า Global Styles + Design System

**Files:**
- Create/Modify: `src/app/globals.css`
- Create: `src/app/(frontend)/layout.tsx`

- [ ] **Step 1: ตั้งค่า global CSS พร้อม Tailwind v4 + design tokens**

แก้ `src/app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-primary: #0D9488;
  --color-primary-dark: #0F766E;
  --color-accent: #F97316;
  --color-background: #FFFBF0;
  --color-text: #1C1917;
  --font-sans: 'Sarabun', sans-serif;
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-sans);
}
```

- [ ] **Step 2: สร้าง frontend layout พร้อม Sarabun font**

สร้าง `src/app/(frontend)/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import '../globals.css'
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

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css src/app/(frontend)/layout.tsx
git commit -m "feat: add design system tokens and frontend layout with Sarabun font"
```

---

## Task 4: สร้าง Shared Components

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/PlaceCard.tsx`
- Create: `src/components/RichText.tsx`

- [ ] **Step 1: สร้าง Navbar component**

สร้าง `src/components/Navbar.tsx`:
```typescript
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
          <Link href="/ประเภท/ธรรมชาติ" className="hover:text-[#0D9488] transition-colors">ธรรมชาติ</Link>
          <Link href="/ประเภท/ชายหาด" className="hover:text-[#0D9488] transition-colors">ชายหาด</Link>
          <Link href="/ประเภท/วัด" className="hover:text-[#0D9488] transition-colors">วัด</Link>
          <Link href="/ประเภท/วัฒนธรรม" className="hover:text-[#0D9488] transition-colors">วัฒนธรรม</Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="เปิดเมนู"
        >
          <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-0.5 bg-gray-700"></span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 text-sm font-medium bg-white">
          <Link href="/ประเภท/ธรรมชาติ" onClick={() => setOpen(false)}>ธรรมชาติ</Link>
          <Link href="/ประเภท/ชายหาด" onClick={() => setOpen(false)}>ชายหาด</Link>
          <Link href="/ประเภท/วัด" onClick={() => setOpen(false)}>วัด</Link>
          <Link href="/ประเภท/วัฒนธรรม" onClick={() => setOpen(false)}>วัฒนธรรม</Link>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: สร้าง PlaceCard component**

สร้าง `src/components/PlaceCard.tsx`:
```typescript
import Image from 'next/image'
import Link from 'next/link'
import type { Place } from '@/payload-types'

type Props = {
  place: Place
}

export function PlaceCard({ place }: Props) {
  const coverImage = typeof place.coverImage === 'object' ? place.coverImage : null
  const province = typeof place.province === 'object' ? place.province : null
  const category = typeof place.category === 'object' ? place.category : null

  return (
    <Link href={`/สถานที่/${place.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
        <div className="relative aspect-[4/3] overflow-hidden">
          {coverImage?.url ? (
            <Image
              src={coverImage.url}
              alt={coverImage.alt || place.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
              🏞️
            </div>
          )}
          {category && (
            <span className="absolute top-3 left-3 bg-[#0D9488] text-white text-xs font-medium px-2 py-1 rounded-full">
              {category.icon} {category.name}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-[#0D9488] transition-colors">
            {place.title}
          </h3>
          {province && (
            <p className="text-sm text-gray-500">📍 {province.name}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: สร้าง RichText renderer**

สร้าง `src/components/RichText.tsx`:
```typescript
import { serializeLexical } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = {
  content: SerializedEditorState
  className?: string
}

export function RichText({ content, className }: Props) {
  if (!content) return null

  return (
    <div className={`prose prose-lg max-w-none prose-headings:font-bold prose-a:text-[#0D9488] ${className ?? ''}`}>
      {serializeLexical({ data: content })}
    </div>
  )
}
```

- [ ] **Step 4: ติดตั้ง @tailwindcss/typography สำหรับ prose**

```bash
npm install @tailwindcss/typography
```

เพิ่มใน `src/app/globals.css`:
```css
@plugin "@tailwindcss/typography";
```

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add Navbar, PlaceCard, and RichText shared components"
```

---

## Task 5: สร้าง Payload Local API Helper

**Files:**
- Create: `src/lib/payload.ts`

- [ ] **Step 1: สร้าง payload helper functions**

สร้าง `src/lib/payload.ts`:
```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getPayloadClient() {
  return getPayload({ config })
}

export async function getFeaturedPlaces(limit = 6) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'places',
    where: { status: { equals: 'published' } },
    limit,
    sort: '-publishedAt',
    depth: 2,
  })
  return result.docs
}

export async function getLatestPlaces(limit = 4) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'places',
    where: { status: { equals: 'published' } },
    limit,
    sort: '-publishedAt',
    depth: 2,
  })
  return result.docs
}

export async function getPlaceBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'places',
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function getAllPlaceSlugs() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'places',
    where: { status: { equals: 'published' } },
    select: { slug: true },
    limit: 1000,
  })
  return result.docs.map((doc) => doc.slug)
}

export async function getPlacesByProvince(provinceSlug: string) {
  const payload = await getPayloadClient()
  const provincesResult = await payload.find({
    collection: 'provinces',
    where: { slug: { equals: provinceSlug } },
    limit: 1,
  })
  const province = provincesResult.docs[0]
  if (!province) return { places: [], province: null }

  const placesResult = await payload.find({
    collection: 'places',
    where: {
      and: [
        { 'province.value': { equals: province.id } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 2,
    limit: 100,
  })
  return { places: placesResult.docs, province }
}

export async function getPlacesByCategory(categorySlug: string) {
  const payload = await getPayloadClient()
  const categoriesResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    limit: 1,
  })
  const category = categoriesResult.docs[0]
  if (!category) return { places: [], category: null }

  const placesResult = await payload.find({
    collection: 'places',
    where: {
      and: [
        { 'category.value': { equals: category.id } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 2,
    limit: 100,
  })
  return { places: placesResult.docs, category }
}

export async function getAllCategories() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    limit: 50,
  })
  return result.docs
}

export async function getRelatedPlaces(currentSlug: string, provinceId: string | number, limit = 3) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'places',
    where: {
      and: [
        { slug: { not_equals: currentSlug } },
        { 'province.value': { equals: provinceId } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 2,
    limit,
  })
  return result.docs
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/payload.ts
git commit -m "feat: add Payload local API helper functions"
```

---

## Task 6: สร้างหน้าแรก

**Files:**
- Create: `src/app/(frontend)/page.tsx`
- Create: `src/components/HeroSection.tsx`

- [ ] **Step 1: สร้าง HeroSection component**

สร้าง `src/components/HeroSection.tsx`:
```typescript
export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          ค้นพบสถานที่ท่องเที่ยวทั่วไทย
        </h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto drop-shadow">
          บทความและรีวิวสถานที่ท่องเที่ยว ครอบคลุมทุกจังหวัดทั่วประเทศ
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: สร้างหน้าแรก**

สร้าง `src/app/(frontend)/page.tsx`:
```typescript
import { HeroSection } from '@/components/HeroSection'
import { PlaceCard } from '@/components/PlaceCard'
import {
  getFeaturedPlaces,
  getLatestPlaces,
  getAllCategories,
} from '@/lib/payload'
import Link from 'next/link'

export const revalidate = 3600

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedPlaces(6),
    getLatestPlaces(4),
    getAllCategories(),
  ])

  return (
    <>
      <HeroSection />

      {/* Featured Places */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">สถานที่แนะนำ</h2>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">ยังไม่มีสถานที่แนะนำ</p>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">หมวดหมู่</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/ประเภท/${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[#FFFBF0] hover:shadow-md transition-all group"
                >
                  <span className="text-4xl">{cat.icon || '📍'}</span>
                  <span className="text-sm font-medium text-center group-hover:text-[#0D9488]">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">อัพเดตล่าสุด</h2>
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">ยังไม่มีบทความล่าสุด</p>
        )}
      </section>
    </>
  )
}
```

- [ ] **Step 3: ตรวจสอบหน้าแรกใน browser**

```bash
npm run dev
```

เปิด http://localhost:3000 ตรวจสอบว่า:
- Hero section แสดงผลถูกต้อง
- ไม่มี console error

- [ ] **Step 4: Commit**

```bash
git add src/app/(frontend)/page.tsx src/components/HeroSection.tsx
git commit -m "feat: add homepage with hero, featured places, categories, and latest articles"
```

---

## Task 7: สร้างหน้าบทความสถานที่

**Files:**
- Create: `src/app/(frontend)/สถานที่/[slug]/page.tsx`
- Create: `src/components/Gallery.tsx`

- [ ] **Step 1: สร้าง Gallery component**

สร้าง `src/components/Gallery.tsx`:
```typescript
'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Media } from '@/payload-types'

type GalleryItem = {
  image: Media | string | number
  id?: string | null
}

type Props = {
  items: GalleryItem[]
}

export function Gallery({ items }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const images = items
    .map((item) => (typeof item.image === 'object' ? item.image : null))
    .filter(Boolean) as Media[]

  if (images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setSelected(i)}
            className="relative aspect-[4/3] overflow-hidden rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            aria-label={`ดูรูปที่ ${i + 1}`}
          >
            {img.url && (
              <Image
                src={img.url}
                alt={img.alt || `รูปที่ ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label="ดูรูปขยาย"
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            onClick={() => setSelected(null)}
            aria-label="ปิด"
          >
            ×
          </button>
          {images[selected]?.url && (
            <div className="relative max-w-4xl max-h-[80vh] w-full h-full">
              <Image
                src={images[selected].url!}
                alt={images[selected].alt || ''}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          )}
          <button
            className="absolute left-4 text-white text-4xl font-bold disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); setSelected(Math.max(0, selected - 1)) }}
            disabled={selected === 0}
            aria-label="รูปก่อนหน้า"
          >
            ‹
          </button>
          <button
            className="absolute right-4 text-white text-4xl font-bold disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); setSelected(Math.min(images.length - 1, selected + 1)) }}
            disabled={selected === images.length - 1}
            aria-label="รูปถัดไป"
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: สร้างหน้าบทความสถานที่**

สร้าง `src/app/(frontend)/สถานที่/[slug]/page.tsx`:
```typescript
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPlaceBySlug, getAllPlaceSlugs, getRelatedPlaces } from '@/lib/payload'
import { Gallery } from '@/components/Gallery'
import { PlaceCard } from '@/components/PlaceCard'
import { RichText } from '@/components/RichText'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPlaceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const place = await getPlaceBySlug(slug)
  if (!place) return {}
  return {
    title: place.title,
    description: `สถานที่ท่องเที่ยว ${place.title} — เที่ยวทั่วไทย`,
  }
}

export default async function PlacePage({ params }: Props) {
  const { slug } = await params
  const place = await getPlaceBySlug(slug)
  if (!place) notFound()

  const coverImage = typeof place.coverImage === 'object' ? place.coverImage : null
  const province = typeof place.province === 'object' ? place.province : null
  const category = typeof place.category === 'object' ? place.category : null

  const related = province
    ? await getRelatedPlaces(place.slug, province.id, 3)
    : []

  return (
    <article>
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        {coverImage?.url ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt || place.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex gap-2 mb-3 flex-wrap">
              {category && (
                <span className="bg-[#0D9488] text-white text-sm px-3 py-1 rounded-full">
                  {category.icon} {category.name}
                </span>
              )}
              {province && (
                <span className="bg-white/20 backdrop-blur text-white text-sm px-3 py-1 rounded-full">
                  📍 {province.name}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">{place.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {place.content && (
              <RichText content={place.content as SerializedEditorState} />
            )}

            {/* Gallery */}
            {place.gallery && place.gallery.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                <Gallery items={place.gallery} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Highlights */}
            {place.highlights && place.highlights.length > 0 && (
              <div className="bg-[#FFFBF0] rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 text-[#0D9488]">✨ จุดเด่น</h3>
                <ul className="space-y-2">
                  {place.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-[#F97316] font-bold mt-0.5">•</span>
                      <span>{h.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Travel Tips */}
            {place.travelTips && (
              <div className="bg-white border rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">🗺️ เคล็ดลับการเดินทาง</h3>
                <RichText content={place.travelTips as SerializedEditorState} className="text-sm" />
              </div>
            )}
          </aside>
        </div>

        {/* Related Places */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">สถานที่ใกล้เคียง</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <PlaceCard key={p.id} place={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(frontend\)/สถานที่/ src/components/Gallery.tsx
git commit -m "feat: add place detail page with gallery, highlights, and related places"
```

---

## Task 8: สร้างหน้าจังหวัดและหน้าประเภท

**Files:**
- Create: `src/app/(frontend)/จังหวัด/[slug]/page.tsx`
- Create: `src/app/(frontend)/ประเภท/[slug]/page.tsx`

- [ ] **Step 1: สร้างหน้าจังหวัด**

สร้าง `src/app/(frontend)/จังหวัด/[slug]/page.tsx`:
```typescript
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPlacesByProvince } from '@/lib/payload'
import { PlaceCard } from '@/components/PlaceCard'

export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { province } = await getPlacesByProvince(slug)
  if (!province) return {}
  return { title: `สถานที่ท่องเที่ยวใน${province.name}` }
}

export default async function ProvincePage({ params }: Props) {
  const { slug } = await params
  const { places, province } = await getPlacesByProvince(slug)
  if (!province) notFound()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">สถานที่ท่องเที่ยวใน{province.name}</h1>
        <p className="text-gray-500">{places.length} สถานที่</p>
      </div>

      {places.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">ยังไม่มีสถานที่ในจังหวัดนี้</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: สร้างหน้าประเภท**

สร้าง `src/app/(frontend)/ประเภท/[slug]/page.tsx`:
```typescript
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPlacesByCategory } from '@/lib/payload'
import { PlaceCard } from '@/components/PlaceCard'

export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { category } = await getPlacesByCategory(slug)
  if (!category) return {}
  return { title: `สถานที่ท่องเที่ยวประเภท${category.name}` }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const { places, category } = await getPlacesByCategory(slug)
  if (!category) notFound()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
          {category.icon} {category.name}
        </h1>
        <p className="text-gray-500">{places.length} สถานที่</p>
      </div>

      {places.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">ยังไม่มีสถานที่ในประเภทนี้</p>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/(frontend)/จังหวัด/" "src/app/(frontend)/ประเภท/"
git commit -m "feat: add province and category listing pages"
```

---

## Task 9: ตั้งค่า Claude Agent Files

**Files:**
- Create: `CLAUDE.md`
- Create: `project.md`
- Create: `task.md`
- Create: `.claude/settings.json`
- Create: `.claude/skills/frontend-design.md`
- Create: `.claude/skills/travel-context.md`

- [ ] **Step 1: สร้าง CLAUDE.md**

สร้าง `CLAUDE.md`:
```markdown
# เที่ยวทั่วไทย — Claude Project Context

## Project Overview
เว็บไซต์อัพเดตสถานที่ท่องเที่ยวไทย สำหรับนักท่องเที่ยวทั่วไป
บทความเขียนโดย admin/editor ผ่าน Payload CMS v3 embedded ใน Next.js 15

## Stack
- **Framework:** Next.js 15 App Router
- **CMS:** Payload CMS v3 (embedded, admin at `/admin`)
- **Database:** Supabase Postgres (via `DATABASE_URI` env var)
- **Styling:** Tailwind CSS v4 (CSS-based config ใน `globals.css`)
- **Font:** Sarabun (Google Fonts, Thai + Latin)
- **Deploy:** Vercel
- **DB Dev Access:** Supabase MCP

## Project Structure
```
src/
  app/
    (frontend)/     — public pages (SSG + ISR, revalidate=3600)
    (payload)/      — Payload admin panel
  collections/      — Payload collection definitions
  components/       — Shared React components
  lib/payload.ts    — Payload local API helpers
payload.config.ts   — Payload configuration
```

## Conventions
- ภาษาไทยใน URL slugs ได้ เช่น `/สถานที่/เขาใหญ่`
- Tailwind ใช้ v4 CSS syntax — ไม่มี `tailwind.config.ts`
- Custom colors ใน `src/app/globals.css` ด้วย `@theme { --color-primary: ... }`
- Design tokens: primary `#0D9488`, accent `#F97316`, bg `#FFFBF0`
- Components อยู่ใน `src/components/` ทุกตัว named export
- Payload queries ทั้งหมดผ่าน `src/lib/payload.ts` เท่านั้น
- SSG pages ใช้ `export const revalidate = 3600`
- ทุก page component เป็น async Server Component (ยกเว้น 'use client')

## Payload Collections
- `places` — สถานที่ท่องเที่ยว (title, slug, province, category, coverImage, gallery, content, highlights, travelTips, status, publishedAt)
- `provinces` — จังหวัด (name, slug, region, coverImage)
- `categories` — ประเภท (name, slug, icon)
- `media` — รูปภาพ (Payload built-in upload)

## Key Commands
```bash
npm run dev       # start dev server
npm run build     # production build
npm run lint      # lint
```

## Environment Variables
- `DATABASE_URI` — Supabase Postgres connection string
- `PAYLOAD_SECRET` — Payload secret (min 32 chars)
- `NEXT_PUBLIC_SERVER_URL` — deployment URL

## Supabase MCP
ใช้ Supabase MCP สำหรับ database operations ระหว่าง development
เรียกใช้ tools: `list_tables`, `execute_sql`, `get_project_url` ฯลฯ
```

- [ ] **Step 2: สร้าง project.md**

สร้าง `project.md`:
```markdown
# เที่ยวทั่วไทย — Project Overview

## วัตถุประสงค์
เว็บไซต์นำเสนอบทความและรีวิวสถานที่ท่องเที่ยวทั่วประเทศไทย ภาษาไทย
กลุ่มเป้าหมาย: นักท่องเที่ยวทั่วไปที่ต้องการข้อมูลสถานที่ท่องเที่ยว

## Design
- โทน tropical สดใส: เขียวมรกต (#0D9488) + ส้ม (#F97316) + ครีม (#FFFBF0)
- Font: Sarabun (Thai Google Font)
- Mobile-first responsive

## ฟีเจอร์ v1
- หน้าแรก: hero, featured places, categories, latest articles
- หน้าบทความ: content, gallery, highlights, travel tips, related places
- หน้าจังหวัด: รวมสถานที่ตามจังหวัด
- หน้าประเภท: รวมสถานที่ตามประเภท
- Admin panel: Payload CMS ที่ /admin

## Out of Scope (v1)
- User login / favorites
- Search / filter
- Map integration
- Comments / ratings
- i18n / multi-language

## Links
- Spec: `docs/superpowers/specs/2026-06-06-travel-update-website-design.md`
- Plan: `docs/superpowers/plans/2026-06-06-travel-website-implementation.md`
```

- [ ] **Step 3: สร้าง task.md**

สร้าง `task.md`:
```markdown
# Task Tracking

## กำลังทำ
- [ ] ตั้งค่า Supabase database และเชื่อมต่อ
- [ ] Deploy ขึ้น Vercel

## รอดำเนินการ
- [ ] เพิ่มข้อมูลตัวอย่าง (seed data) จังหวัดและประเภท
- [ ] ทดสอบ admin panel
- [ ] ตรวจสอบ SEO metadata

## เสร็จแล้ว
- [x] ออกแบบ spec และ architecture
- [x] สร้าง Next.js + Payload CMS project
- [x] สร้าง Payload collections
- [x] สร้าง UI components
- [x] สร้างทุกหน้า (homepage, place, province, category)
- [x] ตั้งค่า CLAUDE.md และ project files
```

- [ ] **Step 4: สร้าง .claude/settings.json**

สร้าง `.claude/settings.json`:
```json
{
  "permissions": {
    "allow": [
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(git:*)",
      "Bash(node:*)",
      "mcp__supabase__*"
    ]
  }
}
```

- [ ] **Step 5: สร้าง project-specific skill สำหรับ frontend design**

สร้าง `.claude/skills/frontend-design.md`:
```markdown
# Frontend Design — เที่ยวทั่วไทย

เมื่อสร้างหรือแก้ไข UI components สำหรับ project นี้:

## Design System
- Primary color: `#0D9488` (teal)
- Accent: `#F97316` (orange)  
- Background: `#FFFBF0` (cream)
- Text: `#1C1917`
- Font: Sarabun (ไม่ใช้ font อื่น)

## Component Patterns
- Cards: `rounded-2xl shadow-md hover:shadow-xl transition-shadow`
- Buttons: `rounded-full bg-[#0D9488] text-white`
- Images: `object-cover` + `aspect-[4/3]` สำหรับ cards
- Sections: `container mx-auto px-4 py-16`

## Tailwind v4
- ไม่มี tailwind.config.ts — ใช้ CSS tokens ใน globals.css
- Custom colors ผ่าน `var(--color-primary)` หรือ `bg-[#0D9488]`

## Accessibility
- ทุก image ต้องมี alt text ภาษาไทยหรืออังกฤษ
- Interactive elements ต้องมี aria-label
- Color contrast ผ่าน WCAG AA
```

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md project.md task.md .claude/
git commit -m "feat: add CLAUDE.md, project.md, task.md, and Claude agent settings"
```

---

## Task 10: ตั้งค่า GitHub Repository

**Files:** ไม่มีไฟล์ใหม่ — เป็น git/GitHub operations

- [ ] **Step 1: สร้าง GitHub repository**

```bash
gh repo create thailand-travel-blog --public --description "เว็บไซต์อัพเดตสถานที่ท่องเที่ยวไทย" --source . --remote origin --push
```

หรือถ้าไม่มี `gh` CLI:
1. ไปที่ https://github.com/new
2. สร้าง repo ชื่อ `thailand-travel-blog`
3. รัน:
```bash
git remote add origin https://github.com/[USERNAME]/thailand-travel-blog.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: ตรวจสอบว่า .env.local ไม่ถูก push**

```bash
git status
```

Expected: `.env.local` ไม่ปรากฏใน staged files (ถูก gitignore แล้ว)

- [ ] **Step 3: ตรวจสอบ repository บน GitHub**

เปิด https://github.com/[USERNAME]/thailand-travel-blog ตรวจสอบว่า:
- ไฟล์ทั้งหมดอยู่ครบ
- `.env.local` ไม่อยู่ใน repository

---

## Task 11: เชื่อมต่อ Supabase และ Build ขั้นสุดท้าย

**Files:**
- Modify: `.env.local` (local only, ไม่ commit)

- [ ] **Step 1: รับ Supabase connection string**

ผ่าน Supabase MCP หรือ Supabase dashboard:
1. ไปที่ https://supabase.com/dashboard
2. เลือก project → Settings → Database
3. Copy connection string (Transaction pooler สำหรับ serverless)
4. แก้ `.env.local`:
```
DATABASE_URI=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

- [ ] **Step 2: Generate PAYLOAD_SECRET**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

ใส่ผลลัพธ์ใน `.env.local`:
```
PAYLOAD_SECRET=<output จากคำสั่งข้างบน>
```

- [ ] **Step 3: รัน production build**

```bash
npm run build
```

Expected: build สำเร็จ ไม่มี error ไม่มี TypeScript errors

- [ ] **Step 4: ทดสอบ production build locally**

```bash
npm start
```

เปิด http://localhost:3000 ตรวจสอบ:
- หน้าแรกโหลดได้
- `/admin` เข้าได้และ redirect ไป setup หรือ login

- [ ] **Step 5: Commit final state**

```bash
git add -A
git commit -m "feat: complete Thailand travel website v1 ready for Vercel deployment"
git push origin main
```

---

## Task 12: เตรียม Vercel Deployment

**Files:** ไม่มีไฟล์ใหม่ — เป็น Vercel configuration

- [ ] **Step 1: เชื่อมต่อ Vercel กับ GitHub**

1. ไปที่ https://vercel.com/new
2. Import repository `thailand-travel-blog`
3. Framework: Next.js (auto-detected)
4. Root Directory: `.` (root)

- [ ] **Step 2: ตั้ง Environment Variables ใน Vercel**

ใน Vercel project settings → Environment Variables เพิ่ม:

| Key | Value |
|-----|-------|
| `DATABASE_URI` | Supabase connection string (Transaction pooler) |
| `PAYLOAD_SECRET` | Secret key ที่ generate ไว้ |
| `NEXT_PUBLIC_SERVER_URL` | `https://[your-project].vercel.app` |

- [ ] **Step 3: Deploy**

กด Deploy ใน Vercel dashboard

Expected: build สำเร็จ deployment URL พร้อมใช้งาน

- [ ] **Step 4: ทดสอบ production URL**

เปิด deployment URL ตรวจสอบ:
- หน้าแรกโหลดได้
- `/admin` เข้าได้
- ไม่มี 500 errors

- [ ] **Step 5: อัพเดต NEXT_PUBLIC_SERVER_URL**

หลังได้ URL จริง อัพเดตใน Vercel env vars:
```
NEXT_PUBLIC_SERVER_URL=https://[actual-deployment-url].vercel.app
```

Redeploy อีกครั้ง

---

## Self-Review Checklist

**Spec coverage:**
- [x] หน้าแรก (hero, featured, categories, latest) → Task 6
- [x] หน้าบทความ (content, gallery, highlights, tips, related) → Task 7
- [x] หน้าจังหวัด → Task 8
- [x] หน้าประเภท → Task 8
- [x] Payload CMS collections → Task 2
- [x] Design system (tropical colors, Sarabun) → Task 3
- [x] SSG + ISR → Tasks 6, 7, 8 (`revalidate = 3600`)
- [x] CLAUDE.md + project.md + task.md → Task 9
- [x] GitHub setup → Task 10
- [x] Vercel deployment → Task 12
- [x] Supabase connection → Task 11

**Type consistency:**
- `getPayloadClient()` ใช้ชื่อเดียวกันทุก task ✅
- `PlaceCard` รับ `place: Place` ทุกที่ ✅
- `RichText` รับ `content: SerializedEditorState` ทุกที่ ✅
- `getFeaturedPlaces`, `getLatestPlaces`, `getPlaceBySlug` ฯลฯ consistent ✅
