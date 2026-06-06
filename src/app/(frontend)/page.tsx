import { HeroSection } from '@/components/HeroSection'
import { PlaceCard } from '@/components/PlaceCard'
import { Reveal } from '@/components/Reveal'
import { getFeaturedPlaces, getLatestPlaces, getAllCategories } from '@/lib/payload'
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
        <Reveal>
          <h2 className="text-3xl font-bold mb-8">สถานที่แนะนำ</h2>
        </Reveal>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((place, i) => (
              <Reveal key={place.id} delay={i * 80}>
                <PlaceCard place={place} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-stone-400">ยังไม่มีสถานที่แนะนำ — เพิ่มข้อมูลผ่าน <a href="/admin" className="text-[#0D9488] dark:text-teal-400 underline">Admin Panel</a></p>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-white dark:bg-stone-900 py-16 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <Reveal>
              <h2 className="text-3xl font-bold mb-8">หมวดหมู่</h2>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
              {categories.map((cat, i) => (
                <Reveal key={cat.id} delay={i * 60}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[#FFFBF0] dark:hover:bg-stone-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <span className="text-4xl transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">{cat.icon || '📍'}</span>
                    <span className="text-sm font-medium text-center group-hover:text-[#0D9488] dark:group-hover:text-teal-400">
                      {cat.name}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="container mx-auto px-4 py-16">
        <Reveal>
          <h2 className="text-3xl font-bold mb-8">อัพเดตล่าสุด</h2>
        </Reveal>
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((place, i) => (
              <Reveal key={place.id} delay={i * 80}>
                <PlaceCard place={place} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-stone-400">ยังไม่มีบทความล่าสุด</p>
        )}
      </section>
    </>
  )
}
