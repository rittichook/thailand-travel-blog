import config from '@/payload.config'
import { getPayload } from 'payload'

export async function getPayloadClient() {
  return getPayload({ config: await config })
}

export async function getFeaturedPlaces(limit = 6) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'places',
    where: { status: { equals: 'published' } },
    limit,
    sort: '-publishedAt',
    depth: 2,
  })
  return result.docs
}

export async function getLatestPlaces(limit = 4) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'places',
    where: { status: { equals: 'published' } },
    limit,
    sort: '-publishedAt',
    depth: 2,
  })
  return result.docs
}

export async function getPlaceBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'places',
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function getAllPlaceSlugs() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'places',
    where: { status: { equals: 'published' } },
    select: { slug: true },
    limit: 1000,
  })
  return result.docs.map((doc) => doc.slug)
}

export async function getPlacesByProvince(provinceSlug: string) {
  const payload = await getPayloadClient()
  const provincesResult = await payload.find({
    collection: 'provinces',
    where: { slug: { equals: provinceSlug } },
    limit: 1,
  })
  const province = provincesResult.docs[0]
  if (!province) return { places: [], province: null }

  const placesResult = await payload.find({
    collection: 'places',
    where: {
      and: [
        { province: { equals: province.id } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 2,
    limit: 100,
  })
  return { places: placesResult.docs, province }
}

export async function getPlacesByCategory(categorySlug: string) {
  const payload = await getPayloadClient()
  const categoriesResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    limit: 1,
  })
  const category = categoriesResult.docs[0]
  if (!category) return { places: [], category: null }

  const placesResult = await payload.find({
    collection: 'places',
    where: {
      and: [
        { category: { equals: category.id } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 2,
    limit: 100,
  })
  return { places: placesResult.docs, category }
}

export async function getAllCategories() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    limit: 50,
  })
  return result.docs
}

export async function getRelatedPlaces(
  currentSlug: string,
  provinceId: string | number,
  limit = 3,
) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'places',
    where: {
      and: [
        { slug: { not_equals: currentSlug } },
        { province: { equals: provinceId } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 2,
    limit,
  })
  return result.docs
}
