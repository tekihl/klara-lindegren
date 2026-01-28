import './stylesheet.scss'
import { initCloverStream } from './utils/cloverFall'
import { initLightbox } from './utils/lightbox'
import { initUpcomingPanel } from './utils/upcomingPanel'
import {
  renderContactEmail,
  renderContactLinks,
  renderMediaEntries,
  renderResume,
  renderReviews,
  renderSanityPosts,
  renderUpcoming,
} from './sanityRender'

initCloverStream()
initLightbox()
initUpcomingPanel()

const sanityPromises: Promise<unknown>[] = []

if (document.querySelector('#sanity-posts')) {
  sanityPromises.push(renderSanityPosts())
}

if (document.querySelector('#contact-email')) {
  sanityPromises.push(renderContactEmail())
}

if (document.querySelector('#contact-links')) {
  sanityPromises.push(renderContactLinks())
}

if (
  document.querySelector('#resume-description') ||
  document.querySelector('#resume-education') ||
  document.querySelector('#resume-work') ||
  document.querySelector('#resume-roles')
) {
  sanityPromises.push(renderResume())
}

if (document.querySelector('#media-wrapper')) {
  sanityPromises.push(renderMediaEntries())
}

if (document.querySelector('#reviews-wrapper')) {
  sanityPromises.push(renderReviews())
}

if (document.querySelector('#upcoming-list')) {
  sanityPromises.push(renderUpcoming())
}

if (!sanityPromises.length) {
  document.documentElement.classList.add('sanity-ready')
} else {
  const timeoutMs = 2000
  const fallback = window.setTimeout(() => {
    document.documentElement.classList.add('sanity-ready')
  }, timeoutMs)

  Promise.all(sanityPromises).finally(() => {
    window.clearTimeout(fallback)
    document.documentElement.classList.add('sanity-ready')
  })
}
