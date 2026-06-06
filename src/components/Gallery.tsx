'use client'

import Image from 'next/image'
import { useState } from 'react'

type MediaItem = {
  url?: string | null
  alt?: string | null
  id?: string | number | null
}

type GalleryItem = {
  image: MediaItem | string | number
  id?: string | null
}

type Props = {
  items: GalleryItem[]
}

export function Gallery({ items }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const images = items
    .map((item) => (typeof item.image === 'object' && item.image !== null ? item.image as MediaItem : null))
    .filter(Boolean) as MediaItem[]

  if (images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] dark:focus:ring-teal-400"
            aria-label={`ดูรูปที่ ${i + 1}`}
          >
            {img.url && (
              <Image
                src={img.url}
                alt={img.alt || `รูปที่ ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-hover:opacity-90"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            )}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label="ดูรูปขยาย"
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold transition-transform duration-200 hover:scale-125 hover:rotate-90"
            onClick={() => setSelected(null)}
            aria-label="ปิด"
          >
            ×
          </button>
          {images[selected]?.url && (
            <div key={selected} className="relative max-w-4xl max-h-[80vh] w-full h-full animate-fade-in-up">
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
            className="absolute left-4 text-white text-4xl font-bold transition-transform duration-200 enabled:hover:scale-125 enabled:hover:-translate-x-1 disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); setSelected(Math.max(0, selected - 1)) }}
            disabled={selected === 0}
            aria-label="รูปก่อนหน้า"
          >
            ‹
          </button>
          <button
            className="absolute right-4 text-white text-4xl font-bold transition-transform duration-200 enabled:hover:scale-125 enabled:hover:translate-x-1 disabled:opacity-30"
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
