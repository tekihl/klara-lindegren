type LightboxItem = {
  type: 'image' | 'video'
  src: string
  caption?: string
}

const buildLightbox = () => {
  const overlay = document.createElement('div')
  overlay.className = 'lightbox'
  overlay.setAttribute('aria-hidden', 'true')

  const backdrop = document.createElement('div')
  backdrop.className = 'lightbox-backdrop'
  overlay.appendChild(backdrop)

  const content = document.createElement('div')
  content.className = 'lightbox-content'
  overlay.appendChild(content)

  const media = document.createElement('div')
  media.className = 'lightbox-media'
  content.appendChild(media)

  const caption = document.createElement('div')
  caption.className = 'lightbox-caption'
  content.appendChild(caption)

  const controls = document.createElement('div')
  controls.className = 'lightbox-controls'
  content.appendChild(controls)

  const prev = document.createElement('button')
  prev.type = 'button'
  prev.className = 'lightbox-prev'
  prev.textContent = 'prev'

  const next = document.createElement('button')
  next.type = 'button'
  next.className = 'lightbox-next'
  next.textContent = 'next'

  const close = document.createElement('button')
  close.type = 'button'
  close.className = 'lightbox-close'
  close.textContent = 'close'

  controls.appendChild(prev)
  controls.appendChild(next)
  controls.appendChild(close)

  document.body.appendChild(overlay)

  return { overlay, backdrop, content, media, prev, next, close }
}

export const initLightbox = () => {
  let lightbox = document.querySelector<HTMLElement>('.lightbox')
  let overlayEl: HTMLElement
  let mediaEl: HTMLElement
  let prevBtn: HTMLButtonElement
  let nextBtn: HTMLButtonElement
  let closeBtn: HTMLButtonElement

  const ensureLightbox = () => {
    if (!lightbox) {
      const built = buildLightbox()
      overlayEl = built.overlay
      mediaEl = built.media
      prevBtn = built.prev
      nextBtn = built.next
      closeBtn = built.close
      lightbox = overlayEl
    }
  }

  let items: LightboxItem[] = []
  let currentIndex = 0
  let captionEl: HTMLElement

  const close = () => {
    if (!lightbox) return
    lightbox.classList.remove('is-open')
    lightbox.setAttribute('aria-hidden', 'true')
    mediaEl.innerHTML = ''
    if (captionEl) {
      captionEl.innerHTML = ''
    }
  }

  const showItem = (index: number) => {
    if (!lightbox) return
    const item = items[index]
    if (!item) return
    currentIndex = index
    mediaEl.innerHTML = ''
    if (captionEl) {
      captionEl.innerHTML = ''
      const parts = (item.caption ?? '').split('||').map((part) => part.trim()).filter(Boolean)
      parts.forEach((part) => {
        const span = document.createElement('span')
        span.className = 'lightbox-caption-item'
        span.textContent = part
        captionEl.appendChild(span)
      })
    }

    if (item.type === 'video') {
      const iframe = document.createElement('iframe')
      iframe.src = item.src
      iframe.setAttribute('allowfullscreen', 'true')
      iframe.setAttribute('title', 'Video')
      iframe.className = 'lightbox-video'
      mediaEl.appendChild(iframe)
    } else {
      const img = document.createElement('img')
      img.src = item.src
      img.alt = ''
      img.className = 'lightbox-image'
      mediaEl.appendChild(img)
    }

    const hasMultiple = items.length > 1
    prevBtn.disabled = !hasMultiple
    nextBtn.disabled = !hasMultiple
  }

  const open = (index: number) => {
    if (!lightbox) return
    lightbox.classList.add('is-open')
    lightbox.setAttribute('aria-hidden', 'false')
    showItem(index)
  }

  const bindGlobal = () => {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const trigger = target.closest<HTMLElement>('[data-lightbox]')
      if (!trigger) return

      event.preventDefault()

      const group = trigger.dataset.group ?? 'default'
      const groupNodes = Array.from(
        document.querySelectorAll<HTMLElement>(`[data-lightbox][data-group="${group}"]`)
      )

      items = groupNodes
        .map((node) => ({
          type: (node.dataset.lightbox as LightboxItem['type']) ?? 'image',
          src: node.dataset.src ?? '',
          caption: node.dataset.caption ?? '',
        }))
        .filter((item) => Boolean(item.src))

      const index = groupNodes.indexOf(trigger)
      open(Math.max(index, 0))
    })

    document.addEventListener('keydown', (event) => {
      if (!lightbox?.classList.contains('is-open')) return
      if (event.key === 'Escape') {
        close()
      }
      if (event.key === 'ArrowRight') {
        showItem((currentIndex + 1) % items.length)
      }
      if (event.key === 'ArrowLeft') {
        showItem((currentIndex - 1 + items.length) % items.length)
      }
    })
  }

  ensureLightbox()
  bindGlobal()

  if (!lightbox) return
  overlayEl = lightbox
  mediaEl = overlayEl.querySelector('.lightbox-media') as HTMLElement
  captionEl = overlayEl.querySelector('.lightbox-caption') as HTMLElement
  prevBtn = overlayEl.querySelector('.lightbox-prev') as HTMLButtonElement
  nextBtn = overlayEl.querySelector('.lightbox-next') as HTMLButtonElement
  closeBtn = overlayEl.querySelector('.lightbox-close') as HTMLButtonElement
  const backdrop = overlayEl.querySelector('.lightbox-backdrop') as HTMLElement

  backdrop.addEventListener('click', close)
  closeBtn.addEventListener('click', close)
  prevBtn.addEventListener('click', () => {
    if (!items.length) return
    showItem((currentIndex - 1 + items.length) % items.length)
  })
  nextBtn.addEventListener('click', () => {
    if (!items.length) return
    showItem((currentIndex + 1) % items.length)
  })
}
