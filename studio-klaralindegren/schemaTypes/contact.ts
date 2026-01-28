import {defineField, defineType} from 'sanity'

export const contact = defineType({
  name: 'contact',
  title: 'contact info',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})