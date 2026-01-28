import {defineField, defineType} from 'sanity'

export const contactLink = defineType({
  name: 'contactLink',
  title: 'Contact Link',
  type: 'document',
  fields: [
    defineField({
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description: 'Higher numbers appear first.',
      validation: (rule) => rule.required().integer(),
    }),
  ],
  orderings: [
    {
      title: 'Priority (Low to High)',
      name: 'priorityAsc',
      by: [{field: 'priority', direction: 'asc'}],
    },
  ],
})
