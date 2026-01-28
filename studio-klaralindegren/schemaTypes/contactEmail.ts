import {defineField, defineType} from 'sanity'

export const contactEmail = defineType({
  name: 'contactEmail',
  title: 'Contact Email',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
  ],
})
