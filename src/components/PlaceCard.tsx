import Image from 'next/image'
import Link from 'next/link'

type MediaType = {
  url?: string | null
  alt?: string | null
}

type ProvinceType = {
  name?: string | null
}

type CategoryType = {
  name?: string | null
  icon?: string | null
}

type PlaceType = {
  id: string | number
  title: string
  slug: string
  coverImage?: MediaType | string | number | null
  province?: ProvinceType | string | number | null
  category?: CategoryType | string | number | null
}

type Props = {
  place: PlaceType
}

export function PlaceCard({ place }: Props) {
  const coverImage = typeof place.coverImage === 'object' && place.coverImage !== null
    ? place.coverImage as MediaType
    : null
  const province = typeof place.province === 'object' && place.province !== null
    ? place.province as ProvinceType
    : null
  const category = typeof place.category === 'object' && place.category !== null
    ? place.category as CategoryType
    : null

  return (
    <Link href={`/places/${place.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 transition-colors group-hover:border-stone-300 dark:group-hover:border-stone-700">
        <div className="relative aspect-[4/3] overflow-hidden">
          {coverImage?.url ? (
            <Image
              src={coverImage.url}
              alt={coverImage.alt || place.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-4xl">
              🏞️
            </div>
          )}
          {category && (
            <span className="absolute top-3 left-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur text-stone-700 dark:text-stone-200 text-xs font-medium px-2.5 py-1 rounded-full">
              {category.icon} {category.name}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium leading-snug mb-1 group-hover:text-[#0D9488] dark:group-hover:text-teal-400 transition-colors">
            {place.title}
          </h3>
          {province && (
            <p className="text-sm text-stone-500 dark:text-stone-400">{province.name}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
