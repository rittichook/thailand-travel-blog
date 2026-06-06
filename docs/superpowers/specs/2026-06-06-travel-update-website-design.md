# เว็บไซต์อัพเดตสถานที่ท่องเที่ยวไทย — Design Spec

**วันที่:** 2026-06-06  
**สถานะ:** Approved  

---

## 1. Overview

เว็บไซต์สำหรับนักท่องเที่ยวทั่วไปในประเทศไทย เผยแพร่บทความ/รีวิวสถานที่ท่องเที่ยวทั่วประเทศไทย ภาษาไทย เขียนโดย admin/editor ผ่าน Payload CMS ที่ฝังอยู่ใน Next.js โดยตรง

**เป้าหมายหลัก:**
- นำเสนอสถานที่ท่องเที่ยวทั่วไทยในรูปแบบบทความคุณภาพสูง
- UI สวยงาม โทน tropical สดใส เน้นรูปภาพ
- SEO ดี โหลดเร็ว ใช้งานง่ายบนมือถือ
- Admin จัดการ content ได้ผ่าน Payload CMS `/admin`

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| CMS | Payload CMS v3 (embedded ใน Next.js) |
| Database | Supabase Postgres |
| Styling | Tailwind CSS v4 |
| Font | Sarabun (Google Fonts) |
| Deploy | Vercel |
| Version Control | GitHub |
| DB Access (dev) | Supabase MCP |

---

## 3. Architecture

Payload CMS v3 รันแบบ embedded ใน Next.js — ทุกอย่างอยู่ใน repo เดียว deploy บน Vercel ที่เดียว Supabase Postgres เป็น database หลักทั้งสำหรับ Payload collections และ metadata เสริม

```
Next.js App (Vercel)
├── /app/(frontend)    — public-facing pages (SSG + ISR)
├── /app/(payload)     — Payload admin panel at /admin
├── /collections       — Payload CMS collections
├── /components        — Shared React components
└── /lib               — utilities, helpers
         |
         ▼
   Supabase Postgres
   (DATABASE_URI via connection string)
```

---

## 4. URL Structure

| URL | หน้า |
|-----|------|
| `/` | หน้าแรก |
| `/สถานที่/[slug]` | หน้าบทความสถานที่ |
| `/จังหวัด/[slug]` | รวมสถานที่ตามจังหวัด |
| `/ประเภท/[slug]` | รวมสถานที่ตามประเภท |
| `/admin` | Payload CMS Admin Panel |

---

## 5. Data Models (Payload Collections)

### Places (สถานที่ท่องเที่ยว)
| Field | Type | รายละเอียด |
|-------|------|-----------|
| title | text | ชื่อสถานที่ |
| slug | text (auto) | URL-friendly |
| province | relation | → Provinces |
| category | relation | → Categories |
| coverImage | upload | รูปหลัก |
| gallery | array of uploads | รูปเพิ่มเติม |
| content | richText (Lexical) | บทความหลัก |
| highlights | array of text | จุดเด่น 3-5 ข้อ |
| travelTips | richText | เคล็ดลับการเดินทาง |
| status | select | draft / published |
| publishedAt | date | วันที่เผยแพร่ |

### Provinces (จังหวัด)
| Field | Type |
|-------|------|
| name | text |
| slug | text |
| region | select (ภาคเหนือ/กลาง/ใต้/อีสาน/ตะวันออก/ตะวันตก) |
| coverImage | upload |

### Categories (ประเภท)
| Field | Type |
|-------|------|
| name | text |
| slug | text |
| icon | text (emoji หรือ icon name) |

ตัวอย่าง categories: ธรรมชาติ, วัด, ชายหาด, น้ำตก, ภูเขา, วัฒนธรรม, อุทยาน, เมืองเก่า

### Media
จัดการโดย Payload built-in media collection รองรับ image optimization

---

## 6. Page Designs

### หน้าแรก (`/`)
1. **Hero Section** — full-width background image, tagline "ค้นพบสถานที่ท่องเที่ยวทั่วไทย"
2. **Featured Places** — grid 3 คอลัมน์ × 2 แถว (6 การ์ด) สถานที่แนะนำ
3. **หมวดหมู่** — icon grid แสดง categories ทั้งหมด
4. **อัพเดตล่าสุด** — 4 บทความใหม่ล่าสุด แนวนอน
5. **จังหวัดยอดนิยม** — quick-link pills/tags

### หน้าบทความ (`/สถานที่/[slug]`)
1. Hero image full-width + overlay ชื่อสถานที่, จังหวัด, ประเภท
2. Rich text content (Lexical)
3. Photo gallery (lightbox)
4. Highlights + Travel Tips (sidebar บน desktop, accordion บน mobile)
5. Related Places — 3 การ์ด (จังหวัดเดียวกัน หรือ category เดียวกัน)

### หน้าจังหวัด (`/จังหวัด/[slug]`)
- Header + cover image จังหวัด
- Grid การ์ดสถานที่ทั้งหมดในจังหวัดนั้น

### หน้าประเภท (`/ประเภท/[slug]`)
- Header + icon ประเภท
- Grid การ์ดสถานที่ทั้งหมดในประเภทนั้น

---

## 7. Design System

**สี:**
- Primary: `#0D9488` (เขียวมรกต / Teal-600)
- Accent: `#F97316` (ส้มพระอาทิตย์ / Orange-500)
- Background: `#FFFBF0` (ครีมอ่อน)
- Text: `#1C1917` (เกือบดำ)

**Typography:**
- Font: Sarabun (400, 500, 600, 700) จาก Google Fonts
- Heading: Sarabun 700
- Body: Sarabun 400

**Component Style:**
- Card: rounded-2xl, shadow-md, hover:shadow-xl transition
- Button: rounded-full, primary color
- Image: object-cover, aspect-ratio คงที่

**Responsive:** Mobile-first, breakpoints sm/md/lg/xl ตาม Tailwind

---

## 8. Rendering Strategy

- **SSG + ISR** สำหรับทุกหน้า public
- `revalidate = 3600` (1 ชั่วโมง) หรือ on-demand revalidation ผ่าน Payload webhook
- หน้า admin (`/admin`) ไม่ cache — dynamic

---

## 9. Project Structure

```
/blog (root)
├── .claude/                    — Claude Code config
│   ├── settings.json
│   └── skills/                 — project-specific skills
├── CLAUDE.md                   — project context สำหรับ Claude
├── docs/
│   └── superpowers/
│       └── specs/              — design specs
├── project.md                  — project overview
├── task.md                     — task tracking
├── src/
│   ├── app/
│   │   ├── (frontend)/         — public pages
│   │   │   ├── page.tsx
│   │   │   ├── สถานที่/[slug]/page.tsx
│   │   │   ├── จังหวัด/[slug]/page.tsx
│   │   │   └── ประเภท/[slug]/page.tsx
│   │   └── (payload)/
│   │       └── admin/[[...segments]]/page.tsx
│   ├── collections/
│   │   ├── Places.ts
│   │   ├── Provinces.ts
│   │   ├── Categories.ts
│   │   └── Media.ts
│   ├── components/
│   │   ├── PlaceCard.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Gallery.tsx
│   │   └── Navbar.tsx
│   └── lib/
│       └── payload.ts          — Payload client helpers
├── payload.config.ts
├── next.config.ts
└── package.json
```

---

## 10. GitHub + Vercel Setup

- Repository: GitHub (public หรือ private)
- Branch strategy: `main` → production, `dev` → development
- Vercel: connect กับ GitHub repo, auto-deploy on push to `main`
- Environment Variables ที่ต้องตั้งใน Vercel:
  - `DATABASE_URI` — Supabase Postgres connection string
  - `PAYLOAD_SECRET` — secret key สำหรับ Payload
  - `NEXT_PUBLIC_SERVER_URL` — URL ของ Vercel deployment

---

## 11. Claude Agent Configuration

**CLAUDE.md** — context หลักสำหรับ Claude ใน project นี้:
- Stack overview
- Naming conventions (ภาษาไทยใน URL/slug ได้)
- Collection structures
- Coding patterns

**`.claude/settings.json`** — permissions และ hooks:
- Allow: `npm`, `git`, `npx`, Supabase MCP tools

**Skills ที่ปรับแต่งสำหรับ project นี้:**
- `frontend-design` — เน้น tropical theme, Sarabun font, Tailwind
- `systematic-debugging` — context ของ Next.js + Payload stack
- `writing-plans` — aware ของ collections และ page structure

---

## 12. Out of Scope (v1)

- ระบบ user login / บันทึก favorites
- ค้นหา/filter สถานที่
- แผนที่ (map integration)
- Comment / rating
- Multi-language (i18n)
- Push notification

สิ่งเหล่านี้สามารถเพิ่มใน v2 ได้
