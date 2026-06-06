import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPlaceBySlug, getAllPlaceSlugs, getRelatedPlaces } from '@/lib/payload'
import { Gallery } from '@/components/Gallery'
import { PlaceCard } from '@/components/PlaceCard'
import { RichText } from '@/components/RichText'
import { Reveal } from '@/components/Reveal'

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

  const coverImage = typeof place.coverImage === 'object' && place.coverImage !== null
    ? place.coverImage as { url?: string; alt?: string }
    : null
  const province = typeof place.province === 'object' && place.province !== null
    ? place.province as { id: string | number; name: string }
    : null
  const category = typeof place.category === 'object' && place.category !== null
    ? place.category as { name: string; icon?: string }
    : null

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
          <div className="w-full h-full bg-gray-300 dark:bg-stone-700 flex items-center justify-center text-6xl">🏞️</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white animate-fade-in-up">
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
              <Reveal>
                <RichText content={place.content as Record<string, unknown>} />
              </Reveal>
            )}

            {/* Gallery */}
            {place.gallery && place.gallery.length > 0 && (
              <Reveal delay={100}>
                <section>
                  <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                  <Gallery items={place.gallery as { image: { url?: string; alt?: string } | string | number; id?: string | null }[]} />
                </section>
              </Reveal>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {place.highlights && place.highlights.length > 0 && (
              <Reveal delay={150}>
                <div className="bg-[#FFFBF0] dark:bg-stone-800 rounded-2xl p-6 transition-colors duration-300 hover:shadow-lg dark:hover:shadow-black/30">
                  <h3 className="font-bold text-lg mb-4 text-[#0D9488] dark:text-teal-400">✨ จุดเด่น</h3>
                  <ul className="space-y-2">
                    {place.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2 text-sm animate-fade-in-up" style={{ animationDelay: `${250 + i * 80}ms` }}>
                        <span className="text-[#F97316] dark:text-orange-400 font-bold mt-0.5">•</span>
                        <span>{h.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {place.travelTips && (
              <Reveal delay={250}>
                <div className="bg-white dark:bg-stone-800 border dark:border-stone-700 rounded-2xl p-6 transition-colors duration-300 hover:shadow-lg dark:hover:shadow-black/30">
                  <h3 className="font-bold text-lg mb-4">🗺️ เคล็ดลับการเดินทาง</h3>
                  <RichText content={place.travelTips as Record<string, unknown>} className="text-sm" />
                </div>
              </Reveal>
            )}
          </aside>
        </div>

        {/* Related Places */}
        {related.length > 0 && (
          <section className="mt-16">
            <Reveal>
              <h2 className="text-2xl font-bold mb-6">สถานที่ใกล้เคียง</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <PlaceCard place={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
