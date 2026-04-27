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

const buildCaption = (item: MediaEntry) => {
  const photographerLine = [
    item.photographer ? `Photographer: ${item.photographer}` : undefined,
    item.extraLineOne,
    item.extraLineTwo,
  ].filter((part): part is string => Boolean(part && part.trim()))
  const detailsLine = [
    formatYear(item.date),
    item.title,
    item.description,
  ].filter((part): part is string => Boolean(part && part.trim()))

  return [
    photographerLine.join(' - '),
    detailsLine.join(' - '),
  ].filter(Boolean).join('||')
}

const createSectionHeading = (text: string) => {
  const heading = document.createElement('h2')
  heading.className = 'media-section-heading'
  heading.textContent = text
  return heading
}

const initMediaMoreOverlays = (wrapper: HTMLElement) => {
  const overlays = Array.from(wrapper.querySelectorAll<HTMLElement>('.media-more-overlay'))
  if (!overlays.length) {
    return
  }

  const mobileQuery = window.matchMedia('(max-width: 720px)')
  if (!mobileQuery.matches || !('IntersectionObserver' in window)) {
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-scroll-visible', entry.isIntersecting)
      })
    },
    {
      threshold: 0.65,
      rootMargin: '-25% 0px -25% 0px',
    },
  )

  overlays.forEach((overlay) => observer.observe(overlay))
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

    const photoItems = items.filter((item) => item.images?.some((image) => image?.asset?.url))
    const videoItems = items.flatMap((item) =>
      (item.videoEmbeds ?? [])
        .map((videoUrl, index) => ({
          item,
          videoUrl,
          thumbnailUrl: item.videoThumbnails?.[index]?.asset?.url,
        }))
        .filter((video) => Boolean(video.videoUrl?.trim())),
    )

    if (photoItems.length) {
      wrapper.appendChild(createSectionHeading('Photos'))
    }

    photoItems.forEach((item) => {
      const images = item.images ?? []
      const firstImage = images.find((image) => image?.asset?.url)
      const firstImageUrl = firstImage?.asset?.url
      if (!firstImageUrl) {
        return
      }

      const entry = document.createElement('article')
      entry.className = 'media-entry'

      const mediaRow = document.createElement('div')
      mediaRow.className = 'media-row'

      const groupId = `media-${item._id}`
      const caption = buildCaption(item)

      const createLightboxTrigger = (src: string, isVisible = false) => {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'media-thumb'
        if (!isVisible) {
          button.hidden = true
        }
        button.setAttribute('data-lightbox', 'image')
        button.setAttribute('data-src', src)
        button.setAttribute('data-group', groupId)
        if (caption) {
          button.setAttribute('data-caption', caption)
        }
        return button
      }

      const firstButton = createLightboxTrigger(firstImageUrl, true)

      const img = document.createElement('img')
      img.src = firstImageUrl
      img.alt = item.title ?? ''
      img.loading = 'lazy'
      img.className = 'media-image'

      firstButton.appendChild(img)

      if (images.length > 1) {
        const overlay = document.createElement('span')
        overlay.className = 'media-more-overlay'
        overlay.textContent = 'se mer'
        firstButton.appendChild(overlay)
      }

      mediaRow.appendChild(firstButton)

      images.slice(1).forEach((image) => {
        const url = image?.asset?.url
        if (!url) return
        mediaRow.appendChild(createLightboxTrigger(url))
      })

      entry.appendChild(mediaRow)

      wrapper.appendChild(entry)
    })

    if (videoItems.length) {
      wrapper.appendChild(createSectionHeading('Videos'))
    }

    videoItems.forEach(({ item, videoUrl, thumbnailUrl }, index) => {
      const entry = document.createElement('article')
      entry.className = 'media-entry'

      const mediaRow = document.createElement('div')
      mediaRow.className = 'media-row'

      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'media-thumb media-video-thumb'
      button.setAttribute('data-lightbox', 'video')
      button.setAttribute('data-src', toEmbedUrl(videoUrl))
      button.setAttribute('data-group', 'media-videos')

      const caption = buildCaption(item)
      if (caption) {
        button.setAttribute('data-caption', caption)
      }

      if (thumbnailUrl) {
        const img = document.createElement('img')
        img.src = thumbnailUrl
        img.alt = item.title ?? `Video ${index + 1}`
        img.loading = 'lazy'
        img.className = 'media-image'
        button.appendChild(img)
      } else {
        const placeholder = document.createElement('div')
        placeholder.className = 'media-video-placeholder'
        button.appendChild(placeholder)
      }

      const overlay = document.createElement('span')
      overlay.className = 'media-more-overlay'
      overlay.textContent = 'se mer'
      button.appendChild(overlay)

      mediaRow.appendChild(button)
      entry.appendChild(mediaRow)
      wrapper.appendChild(entry)
    })

    initMediaMoreOverlays(wrapper)
  } catch (error) {
    console.error(error)
  }
}
