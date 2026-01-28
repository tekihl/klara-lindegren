import { buildSanityUrl } from './sanityClient'

export const renderContactEmail = async () => {
  const target = document.querySelector<HTMLElement>('#contact-email')
  if (!target) {
    return
  }

  const query = '*[_type == "contactEmail"][0]{email}'
  const url = buildSanityUrl(query)

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Sanity request failed: ${response.status}`)
    }

    const payload = await response.json()
    const email = payload?.result?.email
    if (typeof email === 'string' && email.length > 0) {
      target.textContent = email

      if (!target.dataset.copyBound) {
        target.dataset.copyBound = 'true'
        target.style.cursor = 'pointer'
        target.title = 'Click to copy'

        target.addEventListener('click', async () => {
          try {
            if (navigator.clipboard?.writeText) {
              await navigator.clipboard.writeText(email)
            } else {
              const temp = document.createElement('textarea')
              temp.value = email
              temp.setAttribute('readonly', '')
              temp.style.position = 'absolute'
              temp.style.left = '-9999px'
              document.body.appendChild(temp)
              temp.select()
              document.execCommand('copy')
              temp.remove()
            }
            target.textContent = `${email} (copied)`
            window.setTimeout(() => {
              target.textContent = email
            }, 1200)
          } catch (copyError) {
            console.error(copyError)
          }
        })
      }
    }
  } catch (error) {
    console.error(error)
  }
}

export const renderContactLinks = async () => {
  const target = document.querySelector<HTMLElement>('#contact-links')
  if (!target) {
    return
  }

  const query =
    '*[_type == "contactLink"]|order(priority asc){_id,displayName,url,description,priority}'
  const url = buildSanityUrl(query)

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Sanity request failed: ${response.status}`)
    }

    const payload = await response.json()
    const links = payload?.result ?? []

    target.innerHTML = ''

    links.forEach((item: {displayName?: string; url?: string; description?: string}) => {
      const name = item.displayName?.trim()
      const url = item.url?.trim()
      const description = item.description?.trim()

      if (!name && !url && !description) {
        return
      }

      const block = document.createElement('article')
      block.className = 'contact-link'

      if (name || url) {
        if (url) {
          const link = document.createElement('a')
          link.className = 'contact-link__title'
          link.href = url
          link.target = '_blank'
          link.rel = 'noreferrer'
          link.textContent = name ?? url
          block.appendChild(link)
        } else if (name) {
          const title = document.createElement('span')
          title.className = 'contact-link__title'
          title.textContent = name
          block.appendChild(title)
        }
      }

      if (description) {
        const desc = document.createElement('p')
        desc.className = 'contact-link__description'
        desc.textContent = description
        block.appendChild(desc)
      }

      target.appendChild(block)
    })
  } catch (error) {
    console.error(error)
  }
}
