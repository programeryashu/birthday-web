const COLORS = ['#ff6b9d', '#ffd700', '#c9b8ff', '#ff9ecc', '#a8d8f0', '#ff80ab', '#fff']

export function spawnConfetti(count = 60) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = 'confetti-piece'
    el.style.cssText = `
      left:${Math.random() * 100}vw;top:-10px;
      background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
      --dur:${1.5 + Math.random() * 2}s;--del:${Math.random()}s;
      width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
    `
    document.body.appendChild(el)
    el.addEventListener('animationend', () => el.remove())
  }
}

export function triggerFireworks(count = 5) {
  for (let f = 0; f < count; f++) {
    setTimeout(() => {
      const cx = 20 + Math.random() * 60
      const cy = 20 + Math.random() * 50
      for (let i = 0; i < 24; i++) {
        const el = document.createElement('div')
        el.className = 'fw-particle'
        const angle = (i / 24) * Math.PI * 2
        const dist = 60 + Math.random() * 80
        el.style.cssText = `
          left:${cx}vw;top:${cy}vh;
          background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
          --dur:${0.6 + Math.random() * 0.4}s;--del:0s;
          --tx:${Math.cos(angle) * dist}px;--ty:${Math.sin(angle) * dist}px;
        `
        document.body.appendChild(el)
        el.addEventListener('animationend', () => el.remove())
      }
    }, f * 400)
  }
}
