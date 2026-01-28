import { buildSanityUrl } from './sanityClient'

type SanityPost = {
  _id: string
  title?: string
  slug?: string
  publishedAt?: string
}

export const renderSanityPosts = async () => {
  const container = document.querySelector<HTMLDivElement>('#sanity-posts')
  if (!container) {
    return
  }

  container.innerHTML = '<p class="posts-loading">Loading posts...</p>'

  const query = '*[_type == "post"]|order(publishedAt desc)[0...6]{_id,title, "slug": slug.current, publishedAt}'
  const url = buildSanityUrl(query)

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Sanity request failed: ${response.status}`)
    }

    const payload = await response.json()
    const posts: SanityPost[] = payload?.result ?? []

    if (!posts.length) {
      container.innerHTML = '<p class="posts-empty">No posts yet.</p>'
      return
    }

    const list = document.createElement('div')
    list.className = 'posts-grid'

    posts.forEach((post) => {
      const card = document.createElement('article')
      card.className = 'post-card'

      const title = document.createElement('h3')
      title.textContent = post.title ?? 'Untitled post'

      const meta = document.createElement('p')
      meta.className = 'post-meta'
      if (post.publishedAt) {
        const date = new Date(post.publishedAt)
        meta.textContent = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      }

      card.appendChild(title)
      if (meta.textContent) {
        card.appendChild(meta)
      }
      list.appendChild(card)
    })

    container.innerHTML = ''
    container.appendChild(list)
  } catch (error) {
    console.error(error)
    container.innerHTML = '<p class="posts-error">Failed to load posts.</p>'
  }
}
