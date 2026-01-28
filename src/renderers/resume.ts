import { buildSanityUrl } from './sanityClient'

type ResumeDescription = {
  description?: string
}

type ResumeEducation = {
  _id: string
  institution?: string
  teacher?: string
  startYear?: number
  endYear?: number
}

type ResumeWork = {
  _id: string
  title?: string
  role?: string
  work?: string
  author?: string
  director?: string
  conductor?: string
  extraLineOne?: string
  extraLineTwo?: string
  date?: string
}

type ResumeRole = {
  _id: string
  name?: string
  work?: string
  author?: string
  entireRole?: boolean
}

const fetchSanity = async <T>(query: string): Promise<T> => {
  const url = buildSanityUrl(query)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Sanity request failed: ${response.status}`)
  }
  const payload = await response.json()
  return payload?.result
}

const clearAndSetText = (el: HTMLElement, text: string) => {
  el.textContent = text
}

const buildWorkMeta = (item: ResumeWork) => {
  const parts: (string | HTMLElement)[] = []

  if (item.role || item.work || item.author) {
    const line = document.createElement('p')

    if (item.role) {
      line.appendChild(document.createTextNode(item.role))
    }

    if (item.work) {
      if (item.role) {
        line.appendChild(document.createTextNode(' — '))
      }
      const workEl = document.createElement('i')
      workEl.textContent = item.work
      line.appendChild(workEl)
    }

    if (item.author) {
      line.appendChild(document.createTextNode(' ('))
      line.appendChild(document.createTextNode(item.author))
      line.appendChild(document.createTextNode(')'))
    }

    parts.push(line)
  }

  if (item.director) parts.push(`Director: ${item.director}`)
  if (item.conductor) parts.push(`Conductor: ${item.conductor}`)
  if (item.extraLineOne) parts.push(item.extraLineOne)
  if (item.extraLineTwo) parts.push(item.extraLineTwo)
  return parts
}

const buildEducationMeta = (item: ResumeEducation) => {
  const parts: string[] = []
  if (item.institution) parts.push(item.institution)
  if (item.teacher) parts.push(`Teacher: ${item.teacher}`)
  return parts
}

export const renderResume = async () => {
  const descriptionEl = document.querySelector<HTMLElement>('#resume-description')
  const educationEl = document.querySelector<HTMLElement>('#resume-education')
  const workEl = document.querySelector<HTMLElement>('#resume-work')
  const rolesEl = document.querySelector<HTMLElement>('#resume-roles')

  if (!descriptionEl && !educationEl && !workEl && !rolesEl) {
    return
  }

  try {
    const descriptionQuery = '*[_type == "resumeDescription"][0]{description}'
    const educationQuery =
      '*[_type == "resumeEducation"]|order(startYear desc){_id,institution,teacher,startYear,endYear}'
    const workQuery =
      '*[_type == "resumeWork"]|order(date desc){_id,title,role,work,author,director,conductor,extraLineOne,extraLineTwo,date}'
    const rolesQuery =
      '*[_type == "resumeRoleRepertoire"]|order(work asc){_id,name,work,author,entireRole}'

    const [descriptionData, educationItems, workItems, roleItems] = await Promise.all([
      descriptionEl ? fetchSanity<ResumeDescription>(descriptionQuery) : Promise.resolve(null),
      educationEl ? fetchSanity<ResumeEducation[]>(educationQuery) : Promise.resolve([]),
      workEl ? fetchSanity<ResumeWork[]>(workQuery) : Promise.resolve([]),
      rolesEl ? fetchSanity<ResumeRole[]>(rolesQuery) : Promise.resolve([]),
    ])

    if (descriptionEl && descriptionData?.description) {
      clearAndSetText(descriptionEl, descriptionData.description)
    }

    if (educationEl) {
      const items = educationItems ?? []
      educationEl.innerHTML = ''

      const heading = document.createElement('h2')
      heading.className = 'resume-heading'
      heading.textContent = 'Education'
      educationEl.appendChild(heading)

      items.forEach((item) => {
        const block = document.createElement('article')
        block.className = 'resume-entry'

        const years = document.createElement('h3')
        years.className = 'resume-year'
        const start = item.startYear ?? ''
        const end = item.endYear ?? ''
        years.textContent = `${start} - ${end}`.trim()
        block.appendChild(years)

        const meta = buildEducationMeta(item)
        meta.forEach((line) => {
          const p = document.createElement('p')
          p.textContent = line
          block.appendChild(p)
        })

        educationEl.appendChild(block)
      })
    }

    if (workEl) {
      const items = workItems ?? []
      workEl.innerHTML = ''

      const heading = document.createElement('h2')
      heading.className = 'resume-heading'
      heading.textContent = 'Resumé'
      workEl.appendChild(heading)

      const grouped = new Map<number, ResumeWork[]>()
      items.forEach((item) => {
        const year = item.date ? new Date(item.date).getFullYear() : 0
        if (!grouped.has(year)) {
          grouped.set(year, [])
        }
        grouped.get(year)?.push(item)
      })

      Array.from(grouped.entries()).forEach(([year, entries]) => {
        if (!year) {
          return
        }

        const yearHeading = document.createElement('h3')
        yearHeading.className = 'resume-year'
        yearHeading.textContent = String(year)
        workEl.appendChild(yearHeading)

        entries.forEach((item) => {
          const block = document.createElement('article')
          block.className = 'resume-entry'

          if (item.title) {
            const title = document.createElement('h4')
            title.className = 'resume-title'
            title.textContent = item.title
            block.appendChild(title)
          }

          const meta = buildWorkMeta(item)
          meta.forEach((line) => {
            if (typeof line === 'string') {
              const p = document.createElement('p')
              p.textContent = line
              block.appendChild(p)
            } else {
              block.appendChild(line)
            }
          })

          workEl.appendChild(block)
        })
      })
    }

    if (rolesEl) {
      const items = roleItems ?? []
      rolesEl.innerHTML = ''

      const heading = document.createElement('h2')
      heading.className = 'resume-heading'
      heading.textContent = 'Role Repertoire'
      rolesEl.appendChild(heading)

      const entireRoles = items.filter((item) => item.entireRole)
      const partRoles = items.filter((item) => !item.entireRole)

      const renderRoleList = (title: string, listItems: ResumeRole[]) => {
        const sectionTitle = document.createElement('h3')
        sectionTitle.className = 'resume-year'
        sectionTitle.textContent = title
        rolesEl.appendChild(sectionTitle)

        const list = document.createElement('ul')
        list.className = 'resume-roles-list'

        listItems.forEach((item) => {
          const li = document.createElement('li')
          li.className = 'resume-role'

          if (item.name) {
            const nameEl = document.createElement('span')
            nameEl.className = 'resume-role-name'
            nameEl.textContent = item.name
            li.appendChild(nameEl)
          }

          if (item.work) {
            if (item.name) {
              li.appendChild(document.createTextNode(', '))
            }
            const workEl = document.createElement('i')
            workEl.textContent = item.work
            li.appendChild(workEl)
          }

          if (item.author) {
            const authorEl = document.createElement('i')
            authorEl.textContent = ` (${item.author})`
            li.appendChild(authorEl)
          }

          list.appendChild(li)
        })

        rolesEl.appendChild(list)
      }

      renderRoleList('In Full', entireRoles)
      renderRoleList('In Part', partRoles)
    }
  } catch (error) {
    console.error(error)
  }
}
