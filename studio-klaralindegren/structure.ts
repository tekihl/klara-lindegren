import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Resume')
        .child(
          S.list()
            .title('Resume')
            .items([
              S.documentTypeListItem('resumeDescription').title('Description'),
              S.documentTypeListItem('resumeEducation').title('Education'),
              S.documentTypeListItem('resumeWork').title('Work'),
              S.documentTypeListItem('resumeRoleRepertoire').title('Role Repertoire'),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem('mediaEntry').title('Media'),
      S.documentTypeListItem('reviewEntry').title('Reviews & Honors'),
      S.documentTypeListItem('upcomingEntry').title('Upcoming'),
      S.documentTypeListItem('post').title('Posts'),
      S.listItem()
        .title('Contact')
        .child(
          S.list()
            .title('Contact')
            .items([
              S.documentTypeListItem('contactEmail').title('Email'),
              S.documentTypeListItem('contactLink').title('Other'),
            ]),
        ),
    ])
