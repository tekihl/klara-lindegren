import { defineField, defineType } from 'sanity'

export const resumeDescription = defineType({
    name: 'resumeDescription',
    title: 'Description',
    type: 'document',
    fields: [
        defineField({
            name: 'description',
            title: 'Description swe',
            type: 'text',
            rows: 10,
        }),
        defineField({
            name: 'descriptionEng',
            title: 'Description eng',
            type: 'text',
            rows: 10,
        }),
    ],
    preview: {
        prepare: () => ({ title: 'Description' }),
    },
})
