import {defineField, defineType} from 'sanity'

export const mediaEntry = defineType({
  name: 'mediaEntry',
  title: 'Media Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'videoEmbeds',
      title: 'Video Embeds',
      type: 'array',
      of: [{type: 'url'}],
    }),
    defineField({
      name: 'videoThumbnails',
      title: 'Video Thumbnails',
      type: 'array',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'photographer',
      title: 'Photographer',
      type: 'string',
    }),
    defineField({
      name: 'extraLineOne',
      title: 'Free Line 1',
      type: 'string',
    }),
    defineField({
      name: 'extraLineTwo',
      title: 'Free Line 2',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Date (Newest)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
})
