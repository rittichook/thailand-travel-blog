# เที่ยวทั่วไทย — Project Overview

## วัตถุประสงค์
เว็บไซต์นำเสนอบทความและรีวิวสถานที่ท่องเที่ยวทั่วประเทศไทย ภาษาไทย
กลุ่มเป้าหมาย: นักท่องเที่ยวทั่วไปที่ต้องการข้อมูลสถานที่ท่องเที่ยว

## Tech Stack
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

## Design
- โทน tropical สดใส: เขียวมรกต (#0D9488) + ส้ม (#F97316) + ครีม (#FFFBF0)
- Font: Sarabun (Thai Google Font)
- Mobile-first responsive

## URL Structure
| URL | หน้า |
|-----|------|
| `/` | หน้าแรก |
| `/สถานที่/[slug]` | หน้าบทความสถานที่ |
| `/จังหวัด/[slug]` | รวมสถานที่ตามจังหวัด |
| `/ประเภท/[slug]` | รวมสถานที่ตามประเภท |
| `/admin` | Payload CMS Admin Panel |

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
- GitHub: TBD หลัง Task 10
- Vercel: TBD หลัง Task 12
