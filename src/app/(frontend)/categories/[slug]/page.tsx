import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPlacesByCategory } from '@/lib/payload'
import { PlaceCard } from '@/components/PlaceCard'
import { Reveal } from '@/components/Reveal'

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
      <Reveal>
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">
            {category.icon} {category.name}
          </h1>
          <p className="text-gray-500 dark:text-stone-400">{places.length} สถานที่</p>
        </div>
      </Reveal>

      {places.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, i) => (
            <Reveal key={place.id} delay={i * 80}>
              <PlaceCard place={place} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-stone-400">ยังไม่มีสถานที่ในประเภทนี้</p>
      )}
    </div>
  )
}
