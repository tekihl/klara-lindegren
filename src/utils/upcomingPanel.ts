export const initUpcomingPanel = () => {
  const panel = document.querySelector<HTMLElement>('#upcoming-panel')
  if (!panel) {
    return
  }

  panel.classList.add('is-ready')

  const open = () => {
    panel.classList.add('is-open')
    panel.setAttribute('aria-hidden', 'false')
    document.body.classList.add('upcoming-open')
  }

  const close = () => {
    panel.classList.remove('is-open')
    panel.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('upcoming-open')
  }

  document.querySelectorAll<HTMLElement>('.upcoming-toggle').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault()
      open()
    })
  })

  panel.querySelectorAll<HTMLElement>('[data-upcoming-close]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault()
      close()
    })
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) {
      close()
    }
  })
}
