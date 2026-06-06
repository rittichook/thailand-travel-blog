import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Places: CollectionConfig = {
  slug: 'places',
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'province', 'category', 'status', 'publishedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'ชื่อสถานที่',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly เช่น "เขาใหญ่", "หาดป่าตอง"',
      },
    },
    {
      name: 'province',
      type: 'relationship',
      label: 'จังหวัด',
      relationTo: 'provinces',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'ประเภท',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: 'รูปหลัก',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery รูปภาพ',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'เนื้อหาบทความ',
      editor: lexicalEditor({}),
      required: true,
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'จุดเด่น',
      maxRows: 5,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'travelTips',
      type: 'richText',
      label: 'เคล็ดลับการเดินทาง',
      editor: lexicalEditor({}),
    },
    {
      name: 'status',
      type: 'select',
      label: 'สถานะ',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'วันที่เผยแพร่',
      admin: {
        condition: (data) => data.status === 'published',
      },
    },
  ],
}
