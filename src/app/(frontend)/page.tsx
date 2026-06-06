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
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">สถานที่แนะนำ</h2>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-stone-400">ยังไม่มีสถานที่แนะนำ — เพิ่มข้อมูลผ่าน <a href="/admin" className="text-[#0D9488] dark:text-teal-400 underline">Admin Panel</a></p>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-white dark:bg-stone-900 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">หมวดหมู่</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[#FFFBF0] dark:hover:bg-stone-800 hover:shadow-md transition-all group"
                >
                  <span className="text-4xl">{cat.icon || '📍'}</span>
                  <span className="text-sm font-medium text-center group-hover:text-[#0D9488] dark:group-hover:text-teal-400">
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
          <p className="text-gray-500 dark:text-stone-400">ยังไม่มีบทความล่าสุด</p>
        )}
      </section>
    </>
  )
}
