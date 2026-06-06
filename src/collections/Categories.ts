import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'ชื่อประเภท',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly name เช่น "ธรรมชาติ", "ชายหาด"',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (emoji)',
      admin: {
        description: 'เช่น 🌿 🏖️ ⛩️',
      },
    },
  ],
}
