import { buildSanityUrl } from './sanityClient'

type UpcomingEntry = {
  _id: string
  title?: string
  description?: string
  link?: string
  date?: string
  work?: string
  location?: string
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

const formatDate = (date?: string) => {
  if (!date) return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })
}

const parseEventDate = (date?: string) => {
  if (!date) return null
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const startOfToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

const renderEntry = (item: UpcomingEntry, isPast = false) => {
  const entry = document.createElement(item.link ? 'a' : 'article')
  entry.className = isPast ? 'upcoming-entry upcoming-entry--past' : 'upcoming-entry'
  if (item.link) {
    entry.setAttribute('href', item.link)
    entry.setAttribute('target', '_blank')
    entry.setAttribute('rel', 'noreferrer')
  }

  const date = document.createElement('div')
  date.className = 'upcoming-date'
  date.textContent = formatDate(item.date)
  entry.appendChild(date)

  if (item.work) {
    const title = document.createElement('div')
    title.className = 'upcoming-title'
    title.textContent = item.work
    entry.appendChild(title)
  }

  if (item.location) {
    const location = document.createElement('div')
    location.className = 'upcoming-location'
    location.textContent = item.location
    entry.appendChild(location)
  }

  if (item.description) {
    const description = document.createElement('div')
    description.className = 'upcoming-description'
    description.textContent = item.description
    entry.appendChild(description)
  }

  return entry
}

const renderSectionHeading = (text: string) => {
  const heading = document.createElement('h2')
  heading.className = 'upcoming-section-heading'
  heading.textContent = text
  return heading
}

const renderSectionDivider = () => {
  const divider = document.createElement('div')
  divider.className = 'upcoming-section-divider'
  return divider
}

export const renderUpcoming = async () => {
  const list = document.querySelector<HTMLElement>('#upcoming-list')
  if (!list) {
    return
  }

  const query =
    '*[_type == "upcomingEntry"]|order(date asc){_id,description,link,date,work,location}'

  try {
    const items = await fetchSanity<UpcomingEntry[]>(query)
    list.innerHTML = ''

    const today = startOfToday()
    const upcomingItems = items.filter((item) => {
      const date = parseEventDate(item.date)
      return !date || date >= today
    })
    const pastItems = items
      .filter((item) => {
        const date = parseEventDate(item.date)
        return Boolean(date && date < today)
      })
      .sort((a, b) => {
        const aTime = parseEventDate(a.date)?.getTime() ?? 0
        const bTime = parseEventDate(b.date)?.getTime() ?? 0
        return bTime - aTime
      })

    if (upcomingItems.length) {
      list.appendChild(renderSectionHeading('kommande'))
      list.appendChild(renderSectionDivider())

      upcomingItems.forEach((item) => {
        list.appendChild(renderEntry(item))
      })
    }

    if (pastItems.length) {
      list.appendChild(renderSectionHeading('tidigare'))
      list.appendChild(renderSectionDivider())

      pastItems.forEach((item) => {
        list.appendChild(renderEntry(item, true))
      })
    }
  } catch (error) {
    console.error(error)
  }
}
