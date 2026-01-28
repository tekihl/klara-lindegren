import { defineField, defineType } from 'sanity'

export const resumeDescription = defineType({
    name: 'resumeDescription',
    title: 'Description',
    type: 'document',
    fields: [
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 10,
            validation: (rule) => rule.required().max(400),
        }),
    ],
    preview: {
        prepare: () => ({ title: 'Description' }),
    },
})

export const resumeEducation = defineType({
    name: 'resumeEducation',
    title: 'Education Entry',
    type: 'document',
    fields: [
        defineField({
            name: 'institution',
            title: 'Institution',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'teacher',
            title: 'Teacher',
            type: 'string',
        }),
        defineField({
            name: 'startYear',
            title: 'Start Year',
            type: 'number',
            validation: (rule) => rule.required().integer().min(1900),
        }),
        defineField({
            name: 'endYear',
            title: 'End Year',
            type: 'number',
            validation: (rule) => rule.required().integer().min(1900),
        }),
    ],
    orderings: [
        {
            title: 'Start Year (Newest)',
            name: 'startYearDesc',
            by: [{ field: 'startYear', direction: 'desc' }],
        },
    ],
})

export const resumeWork = defineType({
    name: 'resumeWork',
    title: 'Work Entry',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'role',
            title: 'Role',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'work',
            title: 'Work',
            type: 'string',
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'string',
        }),
        defineField({
            name: 'director',
            title: 'Director',
            type: 'string',
        }),
        defineField({
            name: 'conductor',
            title: 'Conductor',
            type: 'string',
        }),
        defineField({
            name: 'extraLineOne',
            title: 'Extra Credits 1',
            type: 'string',
        }),
        defineField({
            name: 'extraLineTwo',
            title: 'Extra Credits 2',
            type: 'string',
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
            options: {
                dateFormat: 'YYYY-MM',
            },
            validation: (rule) => rule.required(),
        }),
    ],
    orderings: [
        {
            title: 'Date (Newest)',
            name: 'dateDesc',
            by: [{ field: 'date', direction: 'desc' }],
        },
    ],
})

export const resumeRoleRepertoire = defineType({
    name: 'resumeRoleRepertoire',
    title: 'Role Repertoire',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'work',
            title: 'Work',
            type: 'string',
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'string',
        }),
        defineField({
            name: 'entireRole',
            title: 'Entire Role',
            type: 'boolean',
        }),
    ],
})
