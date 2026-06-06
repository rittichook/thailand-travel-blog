import {
  mockPlaces,
  mockCategories,
  mockProvinces,
  type MockPlace,
  type MockCategory,
  type MockProvince,
} from './mockData'

// Re-export types for use in components
export type { MockPlace as Place, MockCategory as Category, MockProvince as Province }

export async function getFeaturedPlaces(limit = 6) {
  return mockPlaces.filter((p) => p.status === 'published').slice(0, limit)
}

export async function getLatestPlaces(limit = 4) {
  return mockPlaces
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

export async function getPlaceBySlug(slug: string) {
  return mockPlaces.find((p) => p.slug === slug && p.status === 'published') ?? null
}

export async function getAllPlaceSlugs() {
  return mockPlaces.filter((p) => p.status === 'published').map((p) => p.slug)
}

export async function getPlacesByProvince(provinceSlug: string) {
  const province = mockProvinces.find((p) => p.slug === provinceSlug) ?? null
  if (!province) return { places: [], province: null }
  const places = mockPlaces.filter(
    (p) => p.status === 'published' && p.province.slug === provinceSlug,
  )
  return { places, province }
}

export async function getPlacesByCategory(categorySlug: string) {
  const category = mockCategories.find((c) => c.slug === categorySlug) ?? null
  if (!category) return { places: [], category: null }
  const places = mockPlaces.filter(
    (p) => p.status === 'published' && p.category.slug === categorySlug,
  )
  return { places, category }
}

export async function getAllCategories() {
  return mockCategories
}

export async function getRelatedPlaces(
  currentSlug: string,
  provinceId: string | number,
  limit = 3,
) {
  return mockPlaces
    .filter(
      (p) =>
        p.status === 'published' &&
        p.slug !== currentSlug &&
        p.province.id === provinceId,
    )
    .slice(0, limit)
}
