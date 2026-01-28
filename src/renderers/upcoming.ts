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

    items.forEach((item) => {
      const entry = document.createElement(item.link ? 'a' : 'article')
      entry.className = 'upcoming-entry'
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

      list.appendChild(entry)
    })
  } catch (error) {
    console.error(error)
  }
}
