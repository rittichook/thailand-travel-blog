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
    <div className="container mx-auto px-4 py-14">
      <div className="mb-12 pb-8 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">สถานที่ท่องเที่ยวใน{province.name}</h1>
        <p className="text-stone-500 dark:text-stone-400">{places.length} สถานที่</p>
      </div>

      {places.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <p className="text-stone-500 dark:text-stone-400">ยังไม่มีสถานที่ในจังหวัดนี้</p>
      )}
    </div>
  )
}
