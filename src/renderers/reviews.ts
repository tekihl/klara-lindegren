import { buildSanityUrl } from './sanityClient'

type ReviewEntry = {
  _id: string
  sender?: string
  citation?: string
  link?: string
  date?: string
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

const formatYear = (date?: string) => {
  if (!date) return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return String(parsed.getFullYear())
}

export const renderReviews = async () => {
  const wrapper = document.querySelector<HTMLElement>('#reviews-wrapper')
  if (!wrapper) {
    return
  }

  const query =
    '*[_type == "reviewEntry"]|order(date desc){_id,sender,citation,link,date}'

  try {
    const items = await fetchSanity<ReviewEntry[]>(query)
    wrapper.innerHTML = ''

    items.forEach((item) => {
      const card = document.createElement('article')
      card.className = 'review-card'

      const heading = document.createElement('h3')
      heading.className = 'review-heading'
      const year = formatYear(item.date)
      heading.textContent = year ? `${year} - ${item.sender ?? ''}` : item.sender ?? ''
      card.appendChild(heading)

      if (item.citation) {
        const quote = document.createElement('p')
        quote.className = 'review-citation'
        quote.textContent = `“${item.citation}”`
        card.appendChild(quote)
      }

      if (item.link) {
        const link = document.createElement('a')
        link.className = 'review-link'
        link.href = item.link
        link.target = '_blank'
        link.rel = 'noreferrer'
        link.textContent = '--->'
        card.appendChild(link)
      }

      wrapper.appendChild(card)
    })
  } catch (error) {
    console.error(error)
  }
}
