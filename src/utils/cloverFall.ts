
const cloverIcons = [
    '/notes-notext/Music-eighthnote%20copy%202.svg.png',
    '/notes-notext/Music-eighthnote%20copy.svg.png',
    '/notes-notext/Music-eighthnote.svg%20copy%202.png',
    '/notes-notext/Music-eighthnote.svg%20copy%203.png',
    '/notes-notext/Music-eighthnote.svg%20copy%204.png',
    '/notes-notext/Music-eighthnote.svg%20copy%205.png',
    '/notes-notext/Music-eighthnote.svg%20copy%206.png',
    '/notes-notext/Music-eighthnote.svg%20copy.png',
    '/notes-notext/Music-eighthnote.svg-1.png',
    '/notes-notext/Music-eighthnote.svg-2.png',
    '/notes-notext/Music-eighthnote.svg-3.png',
    '/notes-notext/Music-eighthnote.svg.png',
]

let cloverIndex = 0

export const spawnClover = (x: number, y: number, delayMs = 0) => {
    window.setTimeout(() => {
        const icon = document.createElement('img')
        const drift = (Math.random() * 80 - 40).toFixed(2)
        const duration = (Math.random() * 1.6 + 5.6).toFixed(2)
        const spin = (Math.random() * 8 - 4).toFixed(2)

        icon.src = cloverIcons[cloverIndex % cloverIcons.length]
        cloverIndex += 1
        icon.alt = ''
        icon.className = 'clover-drop'
        icon.style.left = `${x}px`
        const yOffset = 3
        icon.style.top = `${y + yOffset}px`
        icon.style.setProperty('--start-y', `${y + yOffset}px`)
        icon.style.setProperty('--drift', `${drift}px`)
        icon.style.setProperty('--fall-duration', `${duration}s`)
        icon.style.setProperty('--spin', `${spin}deg`)
        icon.setAttribute('aria-hidden', 'true')

        document.body.appendChild(icon)
        icon.addEventListener('animationend', () => icon.remove())
    }, delayMs)
}

export const initCloverStream = () => {
    let armTimer: number | undefined
    let isDropping = false
    let lastMoveX = 0
    let lastMoveY = 0
    let lastMoveTime = 0
    const minSpeed = 0.1
    const dropIntervalMs = 20
    const dropPauseMs = 50
    const spread = 16

    const dropLoop = () => {
        if (!isDropping) {
            return
        }

        if (Date.now() - lastMoveTime > dropPauseMs) {
            isDropping = false
            return
        }

        const offsetX = Math.random() * spread - spread / 2
        const offsetY = Math.random() * spread - spread / 2
        spawnClover(lastMoveX + offsetX, lastMoveY + offsetY)

        window.setTimeout(dropLoop, dropIntervalMs)
    }

    document.addEventListener('mousemove', (event) => {
        const now = Date.now()
        const dx = event.clientX - lastMoveX
        const dy = event.clientY - lastMoveY
        const dt = Math.max(1, now - lastMoveTime)
        const speed = Math.hypot(dx, dy) / dt

        lastMoveX = event.clientX
        lastMoveY = event.clientY
        lastMoveTime = now

        if (speed < minSpeed) {
            isDropping = false
            if (armTimer) {
                window.clearTimeout(armTimer)
                armTimer = undefined
            }
            return
        }

        if (isDropping || armTimer) {
            return
        }

        armTimer = window.setTimeout(() => {
            armTimer = undefined
            if (Date.now() - lastMoveTime > 200) {
                return
            }

            isDropping = true
            dropLoop()
        }, 200)
    })
}
