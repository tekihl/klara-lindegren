import { buildSanityUrl } from './sanityClient'

type ResumeDescription = {
  description?: string
  descriptionEng?: string
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

const descriptionFadeMs = 500

const lockDescriptionHeight = (
  text: HTMLElement,
  descriptions: Record<'swe' | 'eng', string>,
  activeText: string,
) => {
  const heights = Object.values(descriptions)
    .filter(Boolean)
    .map((description) => {
      text.textContent = description
      return text.scrollHeight
    })

  const maxHeight = Math.max(...heights)
  if (Number.isFinite(maxHeight)) {
    text.style.minHeight = `${maxHeight}px`
  }

  text.textContent = activeText
}

export const renderResume = async () => {
  const descriptionEl = document.querySelector<HTMLElement>('#resume-description')
  if (!descriptionEl) {
    return
  }

  const query = '*[_type == "resumeDescription"][0]{description,descriptionEng}'

  try {
    const descriptionData = await fetchSanity<ResumeDescription>(query)
    const descriptions = {
      swe: descriptionData?.description?.trimEnd() ?? '',
      eng: descriptionData?.descriptionEng?.trimEnd() ?? '',
    }

    const initialLanguage = 'swe'
    const initialText = descriptions[initialLanguage]
    if (!initialText) {
      return
    }

    descriptionEl.innerHTML = ''

    const tabs = document.createElement('div')
    tabs.className = 'resume-description-tabs'
    tabs.setAttribute('role', 'tablist')
    tabs.setAttribute('aria-label', 'Resume description language')

    const text = document.createElement('div')
    text.className = 'resume-description-text'
    text.textContent = initialText
    window.requestAnimationFrame(() => {
      text.classList.add('is-visible')
    })

    let activeLanguage: keyof typeof descriptions = initialLanguage
    let switchId = 0

    const setLanguage = (language: keyof typeof descriptions) => {
      const nextText = descriptions[language]
      if (!nextText || language === activeLanguage) {
        return
      }

      activeLanguage = language
      switchId += 1
      const currentSwitch = switchId

      tabs.querySelectorAll<HTMLButtonElement>('.resume-description-tab').forEach((button) => {
        const isSelected = button.dataset.language === language
        button.classList.toggle('is-active', isSelected)
        button.setAttribute('aria-selected', String(isSelected))
      })

      text.classList.remove('is-visible')

      window.setTimeout(() => {
        if (currentSwitch !== switchId) {
          return
        }

        text.textContent = nextText
        window.requestAnimationFrame(() => {
          if (currentSwitch === switchId) {
            text.classList.add('is-visible')
          }
        })
      }, descriptionFadeMs)
    }

    const createTab = (language: keyof typeof descriptions, label: string) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'resume-description-tab'
      button.classList.toggle('is-active', language === initialLanguage)
      button.dataset.language = language
      button.setAttribute('role', 'tab')
      button.setAttribute('aria-selected', String(language === initialLanguage))
      button.textContent = label
      button.addEventListener('click', () => setLanguage(language))
      return button
    }

    tabs.appendChild(createTab('swe', 'Svenska'))
    tabs.appendChild(createTab('eng', 'English'))
    descriptionEl.appendChild(tabs)
    descriptionEl.appendChild(text)
    window.requestAnimationFrame(() => {
      lockDescriptionHeight(text, descriptions, initialText)
    })
  } catch (error) {
    console.error(error)
  }
}
