import type { CollectionConfig } from 'payload'

export const Provinces: CollectionConfig = {
  slug: 'provinces',
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
      label: 'ชื่อจังหวัด',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
    },
    {
      name: 'region',
      type: 'select',
      label: 'ภาค',
      required: true,
      options: [
        { label: 'ภาคเหนือ', value: 'north' },
        { label: 'ภาคกลาง', value: 'central' },
        { label: 'ภาคใต้', value: 'south' },
        { label: 'ภาคอีสาน', value: 'northeast' },
        { label: 'ภาคตะวันออก', value: 'east' },
        { label: 'ภาคตะวันตก', value: 'west' },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: 'รูปปก',
      relationTo: 'media',
    },
  ],
}
