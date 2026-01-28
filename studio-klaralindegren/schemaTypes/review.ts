import {defineField, defineType} from 'sanity'

export const reviewEntry = defineType({
  name: 'reviewEntry',
  title: 'Review Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'sender',
      title: 'Avsändare',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'citation',
      title: 'Citation / Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
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
