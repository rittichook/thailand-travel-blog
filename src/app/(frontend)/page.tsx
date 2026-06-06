import { HeroSection } from '@/components/HeroSection'
import { PlaceCard } from '@/components/PlaceCard'
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
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl font-semibold tracking-tight">สถานที่แนะนำ</h2>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <p className="text-stone-500 dark:text-stone-400">ยังไม่มีสถานที่แนะนำ — เพิ่มข้อมูลผ่าน <a href="/admin" className="text-[#0D9488] dark:text-teal-400 underline underline-offset-4">Admin Panel</a></p>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="border-y border-stone-200 dark:border-stone-800 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold tracking-tight mb-10">หมวดหมู่</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-transparent hover:border-stone-200 dark:hover:border-stone-700 hover:bg-white dark:hover:bg-stone-900 transition-colors group"
                >
                  <span className="text-3xl">{cat.icon || '📍'}</span>
                  <span className="text-sm text-center text-stone-600 dark:text-stone-300 group-hover:text-[#0D9488] dark:group-hover:text-teal-400">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl font-semibold tracking-tight">อัพเดตล่าสุด</h2>
        </div>
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {latest.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <p className="text-stone-500 dark:text-stone-400">ยังไม่มีบทความล่าสุด</p>
        )}
      </section>
    </>
  )
}
