import { buildSanityUrl } from './sanityClient'

type MediaImage = {
  asset?: {
    url?: string
  }
}

type MediaEntry = {
  _id: string
  title?: string
  description?: string
  photographer?: string
  extraLineOne?: string
  extraLineTwo?: string
  date?: string
  images?: MediaImage[]
  videoEmbeds?: string[]
  videoThumbnails?: MediaImage[]
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

const toEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      if (id) {
        return `https://www.youtube.com/embed/${id}`
      }
    }
    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    }
    if (parsed.hostname.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop()
      if (id) {
        return `https://player.vimeo.com/video/${id}`
      }
    }
  } catch {
    return url
  }
  return url
}

const formatYear = (date?: string) => {
  if (!date) return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return String(parsed.getFullYear())
}

export const renderMediaEntries = async () => {
  const wrapper = document.querySelector<HTMLElement>('#media-wrapper')
  if (!wrapper) {
    return
  }

  const query =
    '*[_type == "mediaEntry"]|order(date desc){_id,title,description,photographer,extraLineOne,extraLineTwo,date,images[]{asset->{url}},videoEmbeds,videoThumbnails[]{asset->{url}}}'

  try {
    const items = await fetchSanity<MediaEntry[]>(query)
    wrapper.innerHTML = ''

    items.forEach((item) => {
      const entry = document.createElement('article')
      entry.className = 'media-entry'

      const header = document.createElement('div')
      header.className = 'media-header'

      const headingGroup = document.createElement('span')
      headingGroup.className = 'media-heading-group'

      const title = document.createElement('h2')
      title.className = 'media-title'
      title.textContent = item.title ?? 'Untitled'

      const date = document.createElement('span')
      date.className = 'media-date'
      date.textContent = formatYear(item.date)

      headingGroup.appendChild(date)
      headingGroup.appendChild(document.createTextNode(' - '))
      headingGroup.appendChild(title)
      header.appendChild(headingGroup)
      entry.appendChild(header)

      const metaParts = [
        item.description,
      ].filter((part): part is string => Boolean(part && part.trim()))

      if (metaParts.length) {
        const meta = document.createElement('span')
        meta.className = 'media-meta-line'
        metaParts.forEach((part) => {
          const item = document.createElement('span')
          item.className = 'media-meta-item'
          item.textContent = part
          meta.appendChild(item)
        })
        header.appendChild(meta)
      }

      const mediaRow = document.createElement('div')
      mediaRow.className = 'media-row'

      const groupId = `media-${item._id}`

      const images = item.images ?? []
      images.forEach((image) => {
        const url = image?.asset?.url
        if (!url) return
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'media-thumb'
        button.setAttribute('data-lightbox', 'image')
        button.setAttribute('data-src', url)
        button.setAttribute('data-group', groupId)
        const captionParts = [
          item.photographer ? `Photographer: ${item.photographer}` : undefined,
          item.extraLineOne,
          item.extraLineTwo,
        ].filter((part): part is string => Boolean(part && part.trim()))
        if (captionParts.length) {
          button.setAttribute('data-caption', captionParts.join('||'))
        }

        const img = document.createElement('img')
        img.src = url
        img.alt = item.title ?? ''
        img.loading = 'lazy'
        img.className = 'media-image'

        button.appendChild(img)
        mediaRow.appendChild(button)
      })

      const videos = item.videoEmbeds ?? []
      const thumbnails = item.videoThumbnails ?? []
      videos.forEach((videoUrl, index) => {
        if (!videoUrl) return
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'media-thumb media-video-thumb'
        button.setAttribute('data-lightbox', 'video')
        button.setAttribute('data-src', toEmbedUrl(videoUrl))
        button.setAttribute('data-group', groupId)

        const videoCaptionParts = [
          item.photographer ? `Photographer: ${item.photographer}` : undefined,
          item.extraLineOne,
          item.extraLineTwo,
        ].filter((part): part is string => Boolean(part && part.trim()))
        if (videoCaptionParts.length) {
          button.setAttribute('data-caption', videoCaptionParts.join('||'))
        }

        const thumbUrl = thumbnails[index]?.asset?.url
        if (thumbUrl) {
          const img = document.createElement('img')
          img.src = thumbUrl
          img.alt = item.title ?? 'Video thumbnail'
          img.loading = 'lazy'
          img.className = 'media-image'
          button.appendChild(img)
        } else {
          const placeholder = document.createElement('div')
          placeholder.className = 'media-video-placeholder'
          button.appendChild(placeholder)
        }

        const overlay = document.createElement('div')
        overlay.className = 'media-play-overlay'
        overlay.textContent = 'play video'
        button.appendChild(overlay)

        mediaRow.appendChild(button)
      })

      entry.appendChild(mediaRow)

      const mediaCount = images.length + videos.length
      if (mediaCount > 1) {
        const hint = document.createElement('div')
        hint.className = 'media-swipe-hint'
        hint.appendChild(document.createTextNode('swipe '))
        const arrow = document.createElement('span')
        arrow.className = 'media-swipe-arrow'
        arrow.textContent = '-->'
        hint.appendChild(arrow)
        entry.appendChild(hint)
      }

      wrapper.appendChild(entry)
    })
  } catch (error) {
    console.error(error)
  }
}
